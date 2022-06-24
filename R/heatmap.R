#' Heatmap container for shiny app
#' 
#' Include necessary dependencies.
#' 
#' @param ... Shiny UI code.
#' 
#' @importFrom shiny tagList div
#' 
#' @export
with_heatmap <- function(...){
  tagList(
    ...,
    download_heatmap_ui(),
    heatmap_deps()
  )
}

#' Dependencies
#'
#' JS and CSS assets
#' @importFrom htmltools htmlDependency
heatmap_deps <- function() {
  htmlDependency(
    name = "heatmap.js",
    version = "2.0.5",
    src = c(file = "heatmap.js-2.0.5"),
    script = c("heatmap.min.js", "shiny-heatmap.js"),
    package = "shinyHeatmap"
  )
}

#' Record heatmap data to a file
#'
#' On the JS side, Shiny creates a input$heatmap_data
#' containing the current click data to be recorded
#' to the file
#' 
#' @param path Previously saved heatmap data for persistence.
#' @param target Container selector hosting the heatmap canvas.
#' Default to Shiny fluidPage container. Be careful to change it if
#' you use another template.
#' @param type Event type: click or mouse move. Default to click.
#' @param timeout Necessary if the page needs time to load. 
#' Expressed in milliseconds.
#' @param session Shiny session object. Useful to store heatmap data.
#'
#' @export
#' @importFrom shiny observeEvent 
#' @importFrom jsonlite fromJSON toJSON
record_heatmap <- function(
    path = "www",
    target = ".container-fluid", 
    type = c("click", "move"),
    timeout = 10,
    session = shiny::getDefaultReactiveDomain()
) {
  type <- match.arg(type)
  
  # init heatmap container with tracking enabled
  observeEvent(TRUE, {
    session$sendCustomMessage(
      "initialize_container", 
      list(
        target = target,
        timeout = timeout,
        type = type, 
        track = TRUE
      )
    )
    
    session$userData$heatmap <- list()
  }, once = TRUE)
  
  # Record new data
  observeEvent({
    session$input$heatmap_data
  }, {
    heatmap_len <- length(session$userData$heatmap) + 1
    session$userData$heatmap[[heatmap_len]] <- list(
      x = session$input$heatmap_data$x,
      y = session$input$heatmap_data$y,
      value = session$input$heatmap_data$value
    )
    
    # convert data to JSON and save them to disk
    session$userData$heatmap_json <- toJSON(
      session$userData$heatmap,
      auto_unbox = TRUE,
      pretty = TRUE
    )
    
    platform <- if (session$input$isMobile) "mobile" else "desktop"
    file_path <- file.path(
      path, 
      sprintf(
        "heatmap-%s-timestamp_%s.json", 
        platform,
        format(Sys.time(), format = "%F_%R_%Z")
      )
    )
    con <- file(file_path, open = "w")
    # update JSON file
    write(session$userData$heatmap_json, file_path)
    close(con)
  })
}


#' Download heatmap UI
#'
#' @export
#' @importFrom shiny tagList actionButton sliderInput verbatimTextOutput animationOptions h1
download_heatmap_ui <- function() {
  wellPanel(
    h1("shinyHeatmap UI"),
    sliderInput(
      "heatmap_date", 
      label = "Select dates to aggregate", 
      min = 0, 
      max = 1, 
      value = 1, 
      step = 1,
      animate = animationOptions(
        interval = 2000,
        loop = FALSE,
        playButton = NULL,
        pauseButton = NULL
      ),
      ticks = FALSE
    ),
    verbatimTextOutput("txt_date"),
    actionButton("get_heatmap", "Get heatmap")
  )
}

#' Get heatmap file records
#'
#' List all heatmap recordings
#'
#' @param path Recordings location
#'
#' @return A vector containing full path to recordings.
#' @export
get_heatmap_records <- function(path) {
  tmp_files <- list.files(
    path, 
    pattern = "heatmap.*\\.json", 
    full.names = TRUE
  )
  if (length(tmp_files) < 2) {
    stop("You should have at least 2 recordings.")
  }
  tmp_files
}

#' Read and aggregate heatmap records
#' 
#' Scale coordinates to make sure they render the same on all screens.
#'
#' @param records Returned by \link{get_heatmap_records}.
#' @param viewport_dims Obtained from JS and stored in session$input$viewport_dims.
#'
#' @return A list with aggregated data.
#' @export
read_heatmap_records <- function(records, viewport_dims) {
  tmp_data <- unlist(
    lapply(records, read_json), 
    recursive = FALSE
  )
  
  lapply(tmp_data, function(d) {
    d$x <- round(d$x * viewport_dims$width)
    d$y <- round(d$y * viewport_dims$height)
    d
  })
}

#' Show recorded heatmap
#' 
#' Show and download \link{record_heatmap} data.
#' 
#' @param path Previously saved heatmap data for persistence.
#' @param filename Screenshot file name.
#' @param target Container selector hosting the heatmap canvas.
#' Default to Shiny fluidPage container. Be careful to change it if
#' you use another template.
#' @param timeout Necessary if the page needs time to load. 
#' Expressed in milliseconds.
#' @param options Slot for heatmap options. Expect a (nested) list.
#' See \url{https://www.patrick-wied.at/static/heatmapjs/docs.html#heatmap-configure}.
#' @param session Shiny session object.
#'
#' @export
#' @importFrom shinyscreenshot screenshot
#' @importFrom jsonlite read_json toJSON
#' @importFrom shiny observeEvent updateSliderInput req renderPrint
download_heatmap <- function(
    path = "www",
    filename = "heatmap.png", 
    target = ".container-fluid",
    timeout = 10,
    options = NULL,
    session = shiny::getDefaultReactiveDomain()
) {
  
  output <- get("output", envir = parent.frame(n = 1))
  heatmap_files <- get_heatmap_records(path)
  
  # Populate date select input based on recorded files
  observeEvent(TRUE, {
    updateSliderInput(
      session,
      "heatmap_date",
      min = 1,
      max = length(heatmap_files),
      value = length(heatmap_files)
    )
  }, once = TRUE)
  
  # Just show the date of the selected recording
  output$txt_date <- renderPrint({
    # Bug in Shiny sliderInput with timezone
    # always returns UTC no matter the provided time...
    # We have to reconvert
    req(session$input)
    selected_date <- as.POSIXct(
      gsub(
        "_", 
        " ",
        strsplit(
          strsplit(
            heatmap_files[[session$input$heatmap_date]], 
            "timestamp_"
          )[[1]][2],
          ".json"
        )[[1]][1]
      )
    )
    sprintf("Latest date: %s", selected_date)
  })
  
  # Process data, init canvas, show heatmap
  observeEvent(session$input$heatmap_date, {
    # Read and process data with current screensize
    processed_data <- read_heatmap_records(
      heatmap_files[1:session$input$heatmap_date],
      session$input$viewport_dims
    )
    
    # Init heatmap container without tracking
    session$sendCustomMessage(
      "initialize_container", 
      list(
        target = target,
        timeout = timeout,
        track = FALSE
      )
    )
    
    Sys.sleep(timeout/1000 + 1)
    
    # Add data to heatmap
    session$sendCustomMessage(
      "add_heatmap_data", 
      list(
        data = toJSON(
          processed_data, 
          auto_unbox = TRUE, 
          pretty = TRUE
        ),
        options = options
      )
    )
  }, ignoreInit = TRUE)
  
  # take screenshot
  observeEvent(session$input$get_heatmap, {
    screenshot(scale = 1, filename = filename, selector = target)
    Sys.sleep(1)
  })
}
