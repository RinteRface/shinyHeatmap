library(shiny)
library(shinyHeatmap)

# Define UI for application that draws a histogram
ui <- with_heatmap(
  fluidPage(
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
  
  #record_heatmap()
  
  output$distPlot <- renderPlot({
    # generate bins based on input$bins from ui.R
    x    <- faithful[, 2]
    bins <- seq(min(x), max(x), length.out = input$bins + 1)
    
    # draw the histogram with the specified number of bins
    hist(x, breaks = bins, col = 'darkgray', border = 'white')
  })
  
  #download_heatmap(show_ui = FALSE)
  download_heatmap()
}

# Run the application 
shinyApp(ui = ui, server = server)
