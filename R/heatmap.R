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
    path = "www/heatmap-data.json",
    target = ".container-fluid", 
    type = c("click", "move"),
    timeout = 10,
    session = shiny::getDefaultReactiveDomain()
) {
  input <- get("input", envir = parent.frame(n = 1))
  type <- match.arg(type)
  
  # init heatmap container
  observeEvent(TRUE, {
    session$sendCustomMessage(
      "initialize_container", 
      list(
        target = target,
        timeout = timeout,
        type = type
      )
    )
  }, once = TRUE)
  
  # Record new data
  observeEvent({
    input$heatmap_data
  }, {
    if (is.null(input$heatmap_data)) {
      session$userData$heatmap <- if (file.exists(path)) {
        fromJSON(path, simplifyVector = FALSE)
      } else {
        list()
      }
    } else {
      heatmap_len <- length(session$userData$heatmap) + 1
      session$userData$heatmap[[heatmap_len]] <- list(
        x = input$heatmap_data$x,
        y = input$heatmap_data$y,
        value = input$heatmap_data$value
      )
    }
    
    # convert data to JSON and save them to disk
    session$userData$heatmap_json <- toJSON(session$userData$heatmap)
    con <- file(path, open = "w")
    # update JSON file
    write(session$userData$heatmap_json, path)
    close(con)
  }, ignoreNULL = FALSE)
}


#' Show recorded heatmap
#' 
#' Show and download \link{record_heatmap} data.
#' 
#' @param path Previously saved heatmap data for persistence.
#' @param filename Screenshot file name.
#' @param session Shiny session object.
#' @param clean Whether to clean the heatmap. This allows to click
#' on the UI again and generate a new heatmap. Default to TRUE.
#' @param options Slot for heatmap options. Expect a (nested) list.
#' See \url{https://www.patrick-wied.at/static/heatmapjs/docs.html#heatmap-configure}.
#'
#' @export
#' @importFrom shinyscreenshot screenshot
#' @importFrom jsonlite read_json toJSON
download_heatmap <- function(
    path = "www/heatmap-data.json",
    filename = "heatmap.png", 
    session = shiny::getDefaultReactiveDomain(),
    clean = TRUE,
    options = NULL
) {
  session$sendCustomMessage(
    "add_heatmap_data", 
    list(
      data = toJSON(
        read_json(path), 
        auto_unbox = TRUE, 
        pretty = TRUE
      ),
      options = options
    )
  )
  # take screenshot
  screenshot(scale = 1, filename = filename)
  Sys.sleep(1)
  if (clean) session$sendCustomMessage("remove_heatmap", TRUE)
}
