
# shinyHeatmap

<!-- badges: start -->
[![R-CMD-check](https://github.com/RinteRface/shinyHeatmap/workflows/R-CMD-check/badge.svg)](https://github.com/RinteRface/shinyHeatmap/actions)
[![Lifecycle: experimental](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://lifecycle.r-lib.org/articles/stages.html#experimental)
<!-- badges: end -->

The goal of `{shinyHeatmap}` is to provide a __free__ and __local__ alternative to more advanced user tracking platform such as [Hotjar](https://www.google.com/search?q=hotjar&oq=hotjar&aqs=chrome.0.69i59j0i512j69i60l6.1063j0j7&sourceid=chrome&ie=UTF-8).

`{shinyHeatmap}` generates beautiful and persistent visual heatmaps, representing the app usage across many user sessions. 

<figure>
  <img src="man/figures/shinyHeatmap-demo.png">
  <figcaption>Commute explorer Shiny <a href="https://community.rstudio.com/t/commute-explorer-shiny-contest-submission/104651">app</a> (2021 Shiny Contest winner).</figcaption>
</figure>

<br>
If you ever wondered:

- Is the left action button used?
- Did people notice the new tab?
- Is the top left checkbox still useful?

You should give it a try! If you're concerned about data privacy, `{shinyHeatmap}` only records x and y clicks coordinates on the window.

<video controls="controls" width="800" height="600" name="shinyHeatmap date review." autoplay muted loop>
  <source src="man/figures/shinyHeatmap-ui.mp4">
</video>

## Examples

### {shiny}
<img src="man/figures/shinyHeatmap-basic.png">

### {bs4Dash}
<img src="man/figures/shinyHeatmap-bs4Dash.png">

### {shinydashboard}
<img src="man/figures/shinyHeatmap-shinydashboard.png">

### {shiny.fluent}
<img src="man/figures/shinyHeatmap-shinyFluent.png">

## Installation

You can install the development version of `{shinyHeatmap}` from [GitHub](https://github.com/) with:

``` r
# install.packages("devtools")
devtools::install_github("RinteRface/shinyHeatmap")
```

## Getting started

### How to use it

The app must have a `www` folder since 
heatmap data are stored in `www/heatmap-data.json` by default.

1. In `ui.R`, wrap the UI inside `with_heatmap()`. This initializes the canvas
to record the click coordinates.

2. In `server.R`, call `record_heatmap()`. Overall, this recovers the
coordinates of each click on the JS side and store them in 
`www/heatmap-<USER_AGENT>-<DATE>.json`. 
This may be used later to preview the heatmap by aggregating all compatible user sessions. 
For instance, mobile platforms are not aggregated with destkop since coordinates would be
incorrect. With vanilla `{shiny}` templates like `fluidPage`, 
you don't need to change anything. However, with more complex 
templates, you can pass the target CSS selector of the heatmap 
container with `record_heatmap(target = ".wrapper")`. 
If the app takes time to load, a __timeout__ parameters is available. 
This could be the case when you rely on packages
such as [{waiter}](https://github.com/JohnCoene/waiter).

3. To download the heatmap locally, you must add `download_heatmap()` to your app, which will read data stored in the JSON files, generate the heatmap and save it as a png file. By default, `download_heatmap()`
will show a tiny UI below your app. It allows to see a timeline of the app usage as shown below.
To disable the UI, you can call `download_heatmap(show_ui = FALSE)`, which will show
all the aggregated data as well as take a screenshot of the heatmap area. Don't forget to remove `record_heatmap()` if you don't want to generate extra logs! In general, you don't want to use `download_heatmap()` on a deployed app since end users might not be supposed to access and view usage data.

Below shows an example to record the heatmap:

```r
library(shiny)
library(shinyHeatmap)

# Define UI for application that draws a histogram
ui <- with_heatmap(
  fluidPage(
    # Application title
    titlePanel("Old Faithful Geyser Data"),
    # Sidebar with a slider input for number of bins 
    sidebarLayout(
      sidebarPanel(
        sliderInput(
          "bins",
          "Number of bins:",
          min = 1,
          max = 50,
          value = 30
        )
      ),
      # Show a plot of the generated distribution
      mainPanel(plotOutput("distPlot"))
    )
  )
)

# Define server logic required to draw a histogram
server <- function(input, output, session) {
  
  record_heatmap()
  
  output$distPlot <- renderPlot({
    # generate bins based on input$bins from ui.R
    x    <- faithful[, 2]
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    
    # draw the histogram with the specified number of bins
    hist(x, breaks = bins, col = 'darkgray', border = 'white')
  })
}

# Run the application 
shinyApp(ui = ui, server = server)
```

## Acknowledgement

`{shinyHeatmap}` is proudly powered by the excellent and free [heatmap.js](https://github.com/pa7/heatmap.js) library. Thanks [@pa7](https://github.com/pa7) for making this possible.
