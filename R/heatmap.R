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
    div(
      id = "heatmapContainerWrapper",
      div(
        id = "heatmapContainer",
        ...
      )
    ),
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
    stylesheet = "style.css"
  )
}

#' Record heatmap data to a file
#'
#' On the JS side, Shiny creates a input$heatmap_data
#' containing the current click data to be recorded
#' to the file
#' 
#' @param path Previously saved heatmap data for persistence.
#' @param session Shiny session object. Useful to store heatmap data.
#'
#' @export
#' @importFrom shiny observeEvent 
#' @importFrom jsonlite fromJSON
record_heatmap <- function(
    path = "www/heatmap-data.json",
    session = shiny::getDefaultReactiveDomain()
) {
  input <- get("input", envir = parent.frame(n = 1))
  
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
      session$userData$heatmap[[length(session$userData$heatmap) + 1]] <- list(
        x = input$heatmap_data$x,
        y = input$heatmap_data$y,
        value = input$heatmap_data$value
      )
    }
  }, ignoreNULL = FALSE)
}


#' Show recorder heatmap
#' 
#' Require to have \link{record_heatmap} data.
#' 
#' @param path Previously saved heatmap data for persistence.
#' @param filename Screenshot file name.
#' @param session Shiny session object.
#'
#' @export
#' @importFrom jsonlite toJSON
#' @importFrom shinyscreenshot screenshot
download_heatmap <- function(
    path = "www/heatmap-data.json",
    filename = "www/heatmap.png", 
    session = shiny::getDefaultReactiveDomain()
) {
  data <- toJSON(
    session$userData$heatmap, 
    auto_unbox = TRUE, 
    pretty = TRUE
  )
  
  con <- file(path, open = "w")
  # update JSON file
  write(data, path)
  close(con)
  session$sendCustomMessage("add_heatmap_data", data)
  # take screenshot
  screenshot(scale = 1, filename = filename)
  Sys.sleep(2)
  session$sendCustomMessage("remove_heatmap", TRUE)
}
