#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(shinyHeatmap)

# Define UI for application that draws a histogram
ui <- fluidPage(
  heatmap_container(
    # Application title
    titlePanel("Old Faithful Geyser Data"),
    actionButton("get_heatmap", "Get heatmap"),
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
  
  record_heatmap(type = "move")
  
  output$distPlot <- renderPlot({
    # generate bins based on input$bins from ui.R
    x    <- faithful[, 2]
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    
    # draw the histogram with the specified number of bins
    hist(x, breaks = bins, col = 'darkgray', border = 'white')
  })
  
  observeEvent(input$get_heatmap, {
    download_heatmap(
      options = list(
        radius = 10,
        maxOpacity = .5,
        minOpacity = 0,
        blur = .75,
        gradient =  list(
          ".5" = "blue",
          ".8" = "red",
          ".95" = "white"
        )
      ),
      clean = TRUE
    )
  })
}

# Run the application 
shinyApp(ui = ui, server = server)
