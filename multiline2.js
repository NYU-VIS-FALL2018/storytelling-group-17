// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 660 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
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
var svgFamRelation = d3.select("#chart-line1").append("svg")
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
  svgFamRelation.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueBadLine);

  // Add the valueGoodLine path.
  svgFamRelation.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueGoodLine);

  // Add the X Axis
  svgFamRelation.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svgFamRelation.append("g")
      .call(d3.axisLeft(y));

  var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
        var height = 500;
        var x = 500;
        var y = i * height;
        return 'translate(' + x + ',' + y + ')';
    });
  
  legend.append('rect')
    .attr('width', 50)
    .attr('height', 50)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', 50 + 40)
    .attr('y', 50 - 40)
    .text(function(d) { return d; });

  //bind("#chart-line1");
});
