library(shiny)
library(shinyHeatmap)

# Define UI for application that draws a histogram
ui <- with_heatmap(
  navbarPage(
    id = "navbar",
    "Navbar!",
    tabPanel(
      "Plot",
      sidebarLayout(
        sidebarPanel(radioButtons(
          "plotType", "Plot type",
          c("Scatter" = "p", "Line" = "l")
        )),
        mainPanel(plotOutput("plot"))
      )
    ),
    tabPanel("Summary", verbatimTextOutput("summary")),
    navbarMenu(
      "More",
      tabPanel("Table", DT::dataTableOutput("table")),
      tabPanel(
        "About",
        fluidRow(
          column(6, "Blabla"),
          column(
            3,
            img(
              class = "img-polaroid",
              src = paste0(
                "http://upload.wikimedia.org/",
                "wikipedia/commons/9/92/",
                "1919_Ford_Model_T_Highboy_Coupe.jpg"
              )
            ),
            tags$small(
              "Source: Photographed at the Bay State Antique ",
              "Automobile Club's July 10, 2005 show at the ",
              "Endicott Estate in Dedham, MA by ",
              a(href = "http://commons.wikimedia.org/wiki/User:Sfoskett",
                "User:Sfoskett")
            )
          )
        )
      )
    )
  ))

# Define server logic required to draw a histogram
server <- function(input, output, session) {
  #record_heatmap(
  #  trigger = reactive(input$navbar),
  #  target = "body"
  #)
  #download_heatmap(trigger = reactive(input$navbar))
  process_heatmap(trigger = reactive(input$navbar))
  
  output$plot <- renderPlot({
    plot(cars, type=input$plotType)
  })
  
  output$summary <- renderPrint({
    summary(cars)
  })
  
  output$table <- DT::renderDataTable({
    DT::datatable(cars)
  })
}

# Run the application
shinyApp(ui = ui, server = server)
