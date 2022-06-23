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
    #tags$head(
    #  tags$script(
    #    HTML("var myX, myY, xyOn, myMouseX, myMouseY;
    #    xyOn = true;
    #    function getXYPosition(e){
    #      myMouseX=(e||event).clientX;
    #      myMouseY=(e||event).clientY;
    #      if (document.documentElement.scrollTop > 0) {
    #        myMouseY = myMouseY + document.documentElement.scrollTop;
    #      }
    #      if (xyOn) {
    #        alert('X is ' + myMouseX + ' Y is ' + myMouseY);
    #      }
    #    }
    #    function toggleXY() {
    #      xyOn = !xyOn;
    #      document.getElementById('xyLink').blur();
    #      return false;
    #    }
    #    
    #    $(function(){
    #      document.onmouseup=getXYPosition;
    #    });
    #    ")
    #  )
    #),
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
  
  record_heatmap()
  
  output$distPlot <- renderPlot({
    # generate bins based on input$bins from ui.R
    x    <- faithful[, 2]
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    
    # draw the histogram with the specified number of bins
    hist(x, breaks = bins, col = 'darkgray', border = 'white')
  })
  
  observeEvent(input$get_heatmap, {
    download_heatmap()
  })
}

# Run the application 
shinyApp(ui = ui, server = server)
