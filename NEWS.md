# shinyHeatmap 0.2.0.9200

## New feature
- Introducing `process_heatmap()`, a wrapper around `record_heatmap()`
and `download_heatmap()`. `process_heatmap()` will record the heatmap
by default unless you specify a query parameter `?get_heatmap`,
which will allow to display the results.
- You can now toggle the heatmap visibility while running
`record_heatmap()` so as to be able to change page in multi-tabs
apps. This is necessary because the heatmap z-index is set to the maximum and
you can't click anywhere else after, expect the toggle heatmap button. 

## Breaking changes
- Added new `trigger` parameter for `record_heatmap()` and `download_heatmap()` as first parameters. This allows to record heatmaps for multi-tabs apps like with `shiny::navbarPage()` (See `inst/examples/navbar`).
Leave `trigger` NULL for one page apps. `trigger` expects a reactive expression like `reactive(input$navbar)`.
- The `target` value is now removed from `record_heatmap()`.
Instead, it is written in a file `www/*/target.txt` by `record_heatmap()`,
and subsequently read by `record_heatmap()`. For old apps without this file,
you can manually create one `touch www/<WHATEVER_SUBFOLDER>/target.txt` and type in the DOM selector value, for instance `.container-fluid`.

## Minor change
- The slider to select dates has been replaced by a selectInput. We can display
dates in the input choices which is easier to read (Note: the slider animation capability is lost).

# shinyHeatmap 0.0.0.9000

- Added a `NEWS.md` file to track changes to the package.
