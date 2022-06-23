#' Heatmap container for shiny app
#' 
#' Include necessary dependencies.
#' 
#' @param ... Shiny UI code.
#' 
#' @importFrom shiny tagList div
#' 
#' @export
heatmap_container <- function(...){
  tagList(
    ...,
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
        "heatmap-%s-%s-%s.json", 
        session$options$appToken, 
        platform,
        Sys.Date()
      )
    )
    con <- file(file_path, open = "w")
    # update JSON file
    write(session$userData$heatmap_json, file_path)
    close(con)
  })
}


#' Show recorded heatmap
#' 
#' Show and download \link{record_heatmap} data.
#' 
#' @param path Previously saved heatmap data for persistence.
#' @param filename Screenshot file name.
#' @param session Shiny session object.
#' @param target Container selector hosting the heatmap canvas.
#' Default to Shiny fluidPage container. Be careful to change it if
#' you use another template.
#' @param timeout Necessary if the page needs time to load. 
#' Expressed in milliseconds.
#' @param options Slot for heatmap options. Expect a (nested) list.
#' See \url{https://www.patrick-wied.at/static/heatmapjs/docs.html#heatmap-configure}.
#'
#' @export
#' @importFrom shinyscreenshot screenshot
#' @importFrom jsonlite read_json toJSON
download_heatmap <- function(
    path = "www",
    filename = "heatmap.png", 
    target = ".container-fluid",
    timeout = 10,
    session = shiny::getDefaultReactiveDomain(),
    options = NULL
) {
  
  # Process data with current screensize
  viewport_dims <- session$input$viewport_dims
  
  heatmap_files <- list.files(path, pattern = "heatmap.*\\.json", full.names = TRUE)
  tmp_data <- unlist(
    lapply(heatmap_files, read_json), 
    recursive = FALSE
  )
  processed_data <- lapply(tmp_data, function(data) {
    data$x <- round(data$x * viewport_dims$width)
    data$y <- round(data$y * viewport_dims$height)
    data
  })
  
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
  
  # take screenshot
  screenshot(scale = 1, filename = filename)
  Sys.sleep(1)
}
