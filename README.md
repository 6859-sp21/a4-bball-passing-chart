
# A4 - Basketball Passing Chart #
#### Bhavik Nagda & Samir Wadhwania  ####

## Background ##

Data analytics in basketball has grown tremendously over the past few decades as coaches seek to optimize each and every single possession of the game. The NBA as an organization recognized the need for better data for teams to use, and began recording and publishing precise player and ball tracking data in 2014. This immediately led to new trends in how the game of basketball is visualized, the most famous of which is the now ubiquitous hexagonal shot chart by Kirk Goldsberry:

![](https://fadeawayworld.net/wp-content/uploads/2020/01/golsberry.jpg?x31826)

Most visualizations focus on shooting (appropriately so since that is how you win the game). If we want to focus on actual ball movement throughout a game, however, the closest visualizations that are popular now focus on *assists* - a small subset of the number of passes that take place during a single game. We wanted to use the tracking data gathered by the NBA to look at **all** passes that might occur throughout the game. This led us to create our Basketball Passing Chart.

## Design Rationale ##

### Heatmap ###

The first decision was how we wanted to represent our passes. We knew we wanted to have some sort of *geographic* representation: the Goldsberry shot charts immediately grab your attention because you know what a basketball court looks like and you can visually navigate around the court. We wanted something similar, but needed to figure out how to encode something that had **two** details: a source and a destination. Our original ideas involved lines, as shown below. Either displaying courts side by side or with a transition between source and destination: 

![](https://imgur.com/WMQpbSV.jpg)
![](https://imgur.com/6lO2t8B.jpg)

To begin, we started plotting out the data we had from the NBA...

![](https://imgur.com/YIOAVGp.jpg)

We realized after playing around with the data that we had that this was going to be infeasible: too much information! Overlaying more than just a few lines was too chaotic to get any sort of useful information. But we liked the idea of *clicking* a point on the court and getting information of out of it, so we settled on our final design: a heatmap to represent frequency.

This allows us to present two types of information: source data, and destination data. The default presentation would be the distribution of where passes are made *from*, and clicking on (interacting with) the visualization would allow you to see data specific for that point: where do balls travel *to* from that source location.


### Court ###

Most basketball court visualizations are half-court representations because teams switch sides, and there is no real significance as to which side of the court belongs to whom. All offense takes place on one side of the court, the specific side depending on the team and quarter of the game. As a result, all data is collapsed onto one half-court and represented as such. 

We, however, wanted to make full use of our tracking data. Plays regularly begin on one side of the court and make their way to the offensive side. As a result, we do have meaningful data on the "back half" of the court: passes up the court, around defenders trying to full court press, and in-bounding from under the basket. As a result, we decided to keep the full court design and represent our data in full.

An important design decision was how the binning of locations would work. 1 ft x 1ft boxes gave the most detail, but proved to be too fine -- the buckets needed to be big enough to have enough passes from/to those locations otherwise the display would be very sparse. A 2ft x 2ft box worked well, and was also a good representation for how much space an NBA player might take on the court.

### Shot Chart Percentage ###

When a player has a ball, they can really only do one of three things: dribble, pass, or shoot the ball. As such, we wanted to augment our passing data with useful context by showing a breakdown of shooting percentages by team. Basketball, at the end of the day, is about getting the ball in the basket. This data can also help understand why the passing data might make sense: are players passing *into* high percentage shot locations? Are players passing *out of* low percentage shot locations? 

We represented this with a bar chart next to our court visualization. Clicking a location on the court populates the bar chart with data for that specific point. 

### Animation / Interaction ###

Since we settled on a heatmap representation, the animation technique proved to be quite simple -- a fade transition makes it clear that the data being presented is changing upon clicking a point on the court. The source point is filled in to make clear where the pass is starting (or, if no point is filled in, that you're looking at the source data). 

Our initial design did not make it clear that the visualization was interactive at all, so we added a border around each cell to make clear that the court was composed of individual cells. Highlighting them (and producing a tooltip) while moused over makes it clear to a user very quickly that the visualization can be interacted with.

The bar chart redraws when a new location is clicked on the court. We thought about having the bars reorganize based on shooting percentage, but believed it to be too chaotic / unnecessary. It is quick enough to discern which teams shoot better than others from a specific point, and does not distract you with many bars moving around / on top of each other on every click.

## Development Process ##

Work was mostly split up between data side and visualization side. Samir focused on the data and Bhavik focused on visualization.

### Data Cleaning ###

The tracking data from the NBA required several steps to clean and process. Several hours went just into fine-tuning an algorithm to cycle through each play that we had data for and extract passes. Here are a few images representing steps along the way:

![](https://imgur.com/F0vkZOM.jpg)
![](https://imgur.com/lG8g8vz.jpg)
![](https://imgur.com/K7YONcP.jpg)
For the shot percentage data, we similarly consolidated data from every shot attempted and made in the 2015-2016 season. This allowed us to preprocess the data: binning by location and calculating shot percentages by team. 

While this was mostly done by Samir, Bhavik also contributed to cleaning the shot percentage data and formatting for JS. 

***Data Sources:***
* [NBA 2015-2016 Tracking Data](https://github.com/sealneaward/nba-movement-data) hosted on GitHub
* [NBA API Package](https://github.com/swar/nba_api) to download all shot data by season

### Visualization ###

The first step was to create the basketball court in JS. Initially, we made a half court chart to allow us to play around with whatever data we had. From that point on, the full court design was added, a bar chart next to the court, and title and text to explain the visualization. 

After implementing the basic functionality, effort was focused on refining design points such as the tooltip, animation specifics, color grading, and the overall appearance of the webpage. 

While Bhavik primarily handled the development of the visualization, Samir contributed to the tooltip design and animating the heatmap and bar chart.

### Design ###

*Visual Encoding- Court*: There are indeed a variety of ways we could have depicted the pass frequencies. We could have explored forward vs. backwards passes via histogram or bar chart. We could have explored pass vs. shot vs. dribble frequencies (all ordinal numerical variables). We figured, however, that a visualization of pass frequencies on a basketball court may lend itself to interesting and engaging conclusions or hypotheses. The format is familiar to basketball viewers, given that they've likely seen basketball courts and identify with notions of a '3-point-line' or 'foul-line' or 'the paint'. With that environment settled, we chose to use color as our primary encoding to allow for easy location-based comparisions. As we learned in class, though, color isn't necessarily the most intuitive encoding, so we've augmented the visual with a tooltip to provide more granular, accurate summary data. We've discretized the basketball court into 2ft by 2ft boxes, and assigned a shot frequency to each box. The 2ft discretization parameter was chosen after trial and error, as a balance between granularity and confusion/complexity of smaller boxes. 

*Visual Encoding- Shot Percentage*: Shot percentages are a per-team, per-court-location statistic. In enabling comparisons between teams, we chose a bar-chart encoding scheme. The chart allows users to hover over specific bars to glean specific percentage statistics. While we'd originally depicted all percentages for the chart, our peer-reviewers suggested the appear-on-hover functionality to simplify the visualization. 

*Interaction & Animation*: The tooltip for the court visual & hover for the bar chart remain our primary interactions. Both offer additional information upon engagement, information that may have been too complex or cluttered to statically display on the screen. We've added bar-appearance visualization that iteratively reveals the bars. The design decision here was to (1) gain more exposure to D3 animations, and (2) further catch the viewer's interest. The animation inadvertently compels viewers to explore the visualization until the animation completes. 

*Color Pallette*: For the court heat-map visualization we chose the red-color-scale color set because (1) red color schemes are commonly associated with heatmaps, and (2) many shot-charts use red color schemes. Basketball fans used to seeing shot charts will, supposedly, quickly understand the chart simply from familiarity. The purple color scheme for the bottom chart is intended to be complimentary to the red scheme above. 

### Time ###

*Samir:* Cleaning the data was by far the longest part of the process for me. There was a lot of tweaking and manipulating the data to get it preprocessed for the visualization. I probably spent 12 hours total between the passing data and shooting data, and another 3 hours tweaking the visualization. 

*Bhavik:* The front-end visuals took quite awhile. While we were both familiar with Python, D3 was new. Learning the language and building a novel visual, largely from stratch, was an interesting and useful endeavor. I spent 16 hours working on the front-end visualization, and 4 hours communicating with my partner. 
