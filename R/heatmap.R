#' Heatmap container for shiny app
#' 
#' Include necessary dependencies.
#' 
#' @param ... Shiny UI code.
#' 
#' @importFrom shiny tagList div
#' @importFrom pushbar pushbar_deps
#' 
#' @export
with_heatmap <- function(...){
  tagList(
    ...,
    download_heatmap_ui(),
    pushbar_deps(),
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
#' @param trigger Reactive trigger to initialized the heatmap
#' recording. This is useful if your app contains tabs or navbar.
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
    trigger = NULL,
    path = "www",
    target = ".container-fluid", 
    type = c("click", "move"),
    timeout = 10,
    session = shiny::getDefaultReactiveDomain()
) {
  validate_heatmap_trigger(trigger)
  type <- match.arg(type)
  
  heatmap_data_path <- reactive({
    if (!is.null(trigger)) {
      path <- file.path(path, tolower(trigger()))
    }
    path
  })
  
  # Create heatmap folder.Happen either once
  # if trigger is NULL or each time trigger is updated.
  storage_initialized <- reactiveVal(FALSE)
  observeEvent({
    if (is.null(trigger)) TRUE else trigger()
  }, {
    # create file path for recording
    if (!dir.exists(heatmap_data_path())) {
      dir.create(heatmap_data_path(), recursive = TRUE)
    }
    
    # Write target used to record the heatmap
    # Necessary for download_heatmap.
    target_file_path <- file.path(heatmap_data_path(), "target.txt")
    if (!file.exists(target_file_path)) {
      write(target, target_file_path)
    }
    
    # Make sure this get only run once if trigger is NULL
    if (
      (is.null(trigger) && !storage_initialized()) ||
      !is.null(trigger)
    ) {
      init_heatmap_storage(session, trigger)
    }
    storage_initialized(TRUE)
  })
  
  # Init heatmap container with tracking enabled
  # This has to happen only once.
  observeEvent(TRUE, {
    # Send message to JS to set up the heatmap canvas
    session$sendCustomMessage(
      "initialize_container", 
      list(
        target = target,
        timeout = timeout,
        type = type, 
        track = TRUE
      )
    )
  })
  
  # Record new data at each click or move on the DOM
  # Coordinates are captured on the JS side.
  heatmap_ts <- reactiveVal(format(Sys.time(), format = "%F_%R_%Z"))
  observeEvent({
    session$input$heatmap_data
  }, {
    
    # Add new timestamp. If timestamp is different, we 
    # will write in a new file and also reset storage data
    # so we don't overcount clicks.
    new_timestamp <- format(Sys.time(), format = "%F_%R_%Z")
    if (heatmap_ts() != new_timestamp) {
      heatmap_ts(new_timestamp)
      # clear list
      init_heatmap_storage(session, trigger)
    }
    
    new_data <- list(
      x = session$input$heatmap_data$x,
      y = session$input$heatmap_data$y,
      value = session$input$heatmap_data$value
    )
    if (!is.null(trigger)) {
      heatmap_len <- length(session$userData$heatmap[[trigger()]]) + 1
      session$userData$heatmap[[trigger()]][[heatmap_len]] <- new_data
      data_to_save <- session$userData$heatmap[[trigger()]]
    } else {
      heatmap_len <- length(session$userData$heatmap) + 1
      session$userData$heatmap[[heatmap_len]] <- new_data
      data_to_save <- session$userData$heatmap
    }
    
    data_to_save <- toJSON(
      data_to_save,
      auto_unbox = TRUE,
      pretty = TRUE
    )
    
    platform <- if (session$input$isMobile) "mobile" else "desktop"
    file_path <- file.path(
      heatmap_data_path(), 
      sprintf(
        "heatmap-%s-ts_%s.json", 
        platform,
        heatmap_ts()
      )
    )
    
    # update JSON file
    write(data_to_save, file_path)
  })
}

#' Initialize heatmap data temporary storage.
#'
#' @inheritParams record_heatmap
#'
#' @return Side effect to create a list in
#' session$userData and store the heatmap data.
#' @keywords internal
init_heatmap_storage <- function(session, trigger) {
  session$userData$heatmap <- list()
  # For multiple tabs, we need to store in sub lists.
  if (!is.null(trigger)) {
    session$userData$heatmap[[trigger()]] <- list()
  }
}

#' Download heatmap UI
#'
#' @export
#' @importFrom shiny tagList actionButton sliderInput verbatimTextOutput animationOptions h1
#' @importFrom pushbar pushbar
download_heatmap_ui <- function() {
  pushbar(
    class = "shiny-input-panel",
    style = "background: gainsboro",
    from = "bottom",
    id = "shiny-heatmap-ui",
    h1("shinyHeatmap UI"),
    sliderInput(
      "heatmap_date", 
      label = "Select dates to aggregate", 
      min = 0, 
      max = 1, 
      value = 1, 
      step = 1,
      animate = animationOptions(
        interval = 1000,
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
    # Some case where x and y are empty lists...
    if (length(d$x) > 0 && length(d$y) > 0) {
      d$x <- round(d$x * viewport_dims$width)
      d$y <- round(d$y * viewport_dims$height)
      d
    }
  })
}


#' Take heatmap screenshot
#'
#' @param filename Where to save the screenshot.
#' @param target Element to capture within the page. CSS
#' selector ...
#'
#' @keywords internal
#' @importFrom shinyscreenshot screenshot
take_heatmap_screenshot <- function(filename, target) {
  screenshot(
    scale = 1, 
    filename = filename, 
    selector = target
  )
  Sys.sleep(1)
}

#' Safety checks
#'
#' @inheritParams record_heatmap
#'
#' @return Stop app if conditions are not met.
#' @keywords internal
validate_heatmap_trigger <- function(trigger) {
  if (!is.null(trigger)) {
    if (!is.reactive(trigger)) {
      stop(
        "trigger must be a reactive expression:
        reactive(input$<name>)."
      )
    }
  }
}

#' Show recorded heatmap
#' 
#' Show and download \link{record_heatmap} data.
#' @inheritParams record_heatmap
#' @param filename Screenshot file name.
#' @param show_ui Whether to show the download UI. Default to TRUE.
#' @param options Slot for heatmap options. Expect a (nested) list.
#' See \url{https://www.patrick-wied.at/static/heatmapjs/docs.html#heatmap-configure}.
#'
#' @export
#' @importFrom jsonlite read_json toJSON
#' @importFrom shiny observeEvent updateSliderInput req renderPrint
#' @importFrom pushbar setup_pushbar pushbar_open
download_heatmap <- function(
    trigger = NULL,
    path = "www",
    filename = "heatmap.png", 
    timeout = 10,
    show_ui = TRUE,
    options = NULL,
    session = shiny::getDefaultReactiveDomain()
) {
  validate_heatmap_trigger(trigger)
  output <- get("output", envir = parent.frame(n = 1))
  
  data_path <- reactive({
    if (!is.null(trigger)) {
      path <- file.path(path, tolower(trigger()))
    }
    path
  })
  
  heatmap_files <- reactive({
    get_heatmap_records(data_path())
  })
  
  target <- reactive({
    readLines(file.path(data_path(), "target.txt"))
  })
  
  setup_pushbar(overlay = FALSE)
  
  observeEvent(session$input$heatmapUITrigger, {
    if (show_ui) {
      pushbar_open(id = "shiny-heatmap-ui")
    }
  })
  
  # Populate date select input based on recorded files
  slider_updated <- reactiveVal(FALSE)
  observeEvent(heatmap_files(), {
    updateSliderInput(
      session,
      "heatmap_date",
      min = 1,
      max = length(heatmap_files()),
      value = length(heatmap_files())
    )
    slider_updated(TRUE)
  })
  
  # Just show the date of the selected recording
  output$txt_date <- renderPrint({
    # Bug in Shiny sliderInput with timezone
    # always returns UTC no matter the provided time...
    # We have to reconvert
    req(session$input, slider_updated())
    selected_date <- as.POSIXct(
      gsub(
        "_", 
        " ",
        strsplit(
          strsplit(
            heatmap_files()[[session$input$heatmap_date]], 
            "timestamp_"
          )[[1]][2],
          ".json"
        )[[1]][1]
      )
    )
    sprintf("Latest date: %s", selected_date)
  })
  
  # Reset slider_updated status whenever target is changed
  if (!is.null(target)) {
    observeEvent({
      target()
    }, {
      slider_updated(FALSE)
    })
  }
  
  # Process data, init canvas, show heatmap
  observeEvent(session$input$heatmap_date, {
    # Read and process data with current screensize
    processed_data <- read_heatmap_records(
      heatmap_files()[1:session$input$heatmap_date],
      session$input$viewport_dims
    )
    
    # Init heatmap container without tracking
    session$sendCustomMessage(
      "initialize_container", 
      list(
        target = target(),
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
    
    # Automatically download screenshot if UI not visible
    if (!show_ui) {
      take_heatmap_screenshot(filename, target())
    }
  }, ignoreInit = TRUE)
  
  # Take screenshot
  if (show_ui) {
    observeEvent(session$input$get_heatmap, {
      take_heatmap_screenshot(filename, target())
    })
  }
}
