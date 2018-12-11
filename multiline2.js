// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueBadLine = d3.line()
    .x(function(d) { return x(d.Percentage); })
    .y(function(d) { return y(d.Bad); });

// define the 2nd line
var valueGoodLine = d3.line()
    .x(function(d) { return x(d.Percentage); })
    .y(function(d) { return y(d.Good); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart-line1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("FamRelation.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.Percentage = +d.Percentage;
      d.Bad = +d.Bad;
      d.Good = +d.Good;
  });

  // Scale the range of the data
  x.domain([-1,20]);
  y.domain([0,20]);

  // Add the valueBadLine path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueBadLine);

  // Add the valueGoodLine path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueGoodLine);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  bind("#chart-line1");
});
