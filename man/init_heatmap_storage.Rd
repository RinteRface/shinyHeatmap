% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/utils.R
\name{init_heatmap_storage}
\alias{init_heatmap_storage}
\title{Initialize heatmap data temporary storage.}
\usage{
init_heatmap_storage(session, trigger)
}
\arguments{
\item{session}{Shiny session object. Useful to store heatmap data.}

\item{trigger}{Reactive trigger to initialized the heatmap
recording. This is useful if your app contains tabs or navbar.}
}
\value{
Side effect to create a list in
session$userData and store the heatmap data.
}
\description{
Initialize heatmap data temporary storage.
}
\keyword{internal}
