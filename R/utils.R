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
with_heatmap <- function(...) {
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
#' @keywords internal
heatmap_deps <- function() {
  htmlDependency(
    name = "heatmap.js",
    version = "2.0.5",
    src = c(file = "heatmap.js-2.0.5"),
    script = c("heatmap.min.js", "shiny-heatmap.js"),
    package = "shinyHeatmap"
  )
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
#' @keywords internal
#' @importFrom shiny tagList actionButton sliderInput verbatimTextOutput animationOptions h1
#' @importFrom pushbar pushbar
download_heatmap_ui <- function() {
  pushbar(
    class = "shiny-input-panel",
    style = "background: gainsboro",
    from = "bottom",
    id = "shiny-heatmap-ui",
    h1("shinyHeatmap UI"),
    selectInput(
      "heatmap_date", 
      label = "Select a date",
      choices = list()
    ),
    selectInput("user_agent", label = "Platform", choices = list()),
    actionButton("get_heatmap", "Get heatmap")
  )
}

#' Get heatmap file records
#'
#' List all heatmap recordings
#'
#' @param path Recordings location.
#'
#' @return A vector containing full path to recordings.
#' @keywords internal
get_heatmap_records <- function(path) {
  list.files(
    path, 
    pattern = "heatmap.*\\.json", 
    full.names = TRUE
  )
}

#' Read and aggregate heatmap records
#' 
#' Scale coordinates to make sure they render the same on all screens.
#'
#' @param records Returned by \link{get_heatmap_records}.
#' @param viewport_dims Obtained from JS and stored in session$input$viewport_dims.
#'
#' @return A list with aggregated data.
#' @keywords internal
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
#' @importFrom shiny is.reactive
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
