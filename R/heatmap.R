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
#' @param ... Internal. Don't use.
#'
#' @export
#' @importFrom shiny observeEvent reactive reactiveVal
#' @importFrom jsonlite fromJSON toJSON
record_heatmap <- function(
    trigger = NULL,
    path = "www",
    target = ".container-fluid", 
    type = c("click", "move"),
    timeout = 10,
    session = shiny::getDefaultReactiveDomain(),
    ...
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
  }, priority = 1)
  
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
    session = shiny::getDefaultReactiveDomain(),
    ...
) {
  validate_heatmap_trigger(trigger)
  
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
  
  setup_pushbar()
  
  observeEvent(session$input$heatmapUITrigger, {
    if (show_ui) {
      pushbar_open(id = "shiny-heatmap-ui")
    }
  })
  
  # Populate date select input based on recorded files
  observeEvent(heatmap_files(), {
    updateSliderInput(
      session,
      "heatmap_date",
      min = 1,
      max = length(heatmap_files()),
      value = length(heatmap_files())
    )
  })
  
  # Just show the date of the selected recording
  observeEvent(session$input$heatmap_date, {
    # Bug in Shiny sliderInput with timezone
    # always returns UTC no matter the provided time...
    # We have to reconvert
    selected_date <- as.POSIXct(
      gsub(
        "_", 
        " ",
        strsplit(
          strsplit(
            heatmap_files()[[session$input$heatmap_date]], 
            "ts_"
          )[[1]][2],
          ".json"
        )[[1]][1]
      )
    )
    updateSliderInput(
      session, 
      "heatmap_date", 
      label = sprintf("Latest date: %s", selected_date)
    )
  })
  
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
        showUI = show_ui,
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


#' Either record or show heatmap depending on
#' configuration.
#' 
#' By default, \link{process_heatmap} records the heatmap.
#' However, if you set \code{options("shinyheatmap.mode" = 'display')},
#' the function will run in display mode to see the results.
#' This is useful if you want to use shinytest2 to control
#' the app and display the results without affecting the deployed 
#' production app.
#' 
#' @param ... Pass in parameters for \link{record_heatmap} and
#' \link{download_heatmap}.
#'
#' @export
process_heatmap <- function(...) {
  caller_func <- deparse(sys.call())
  if (!shiny::isRunning()) {
    stop(
      sprintf(
        "%s must run inside Shiny server session.",
        caller_func
      )
    )
  }
  
  # process_heatmap is called in server.R
  session <- get("session", envir = parent.frame(n = 1))
  
  # Trigger once
  observeEvent({
    session$clientData
  }, {
    clientData <- session$clientData
    res <- parseQueryString(clientData$url_search)
    if (length(res) > 0) {
      # get the query and send it to JS
      # to trigger a click on the project button
      mode <-  if (length(res) > 0 && "get_heatmap" %in% names(res)) {
        do.call(download_heatmap, list(...))
      } 
    } else {
      do.call(record_heatmap, list(...))
    }
  })
}
