var margin = {top:20, bottom:20, right:20, left:20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;


var arc = d3.arc()
    .outterRadius(radius-10)
    .innerRadius(radius-70)

var pie = d3.pie()
    .sort(null)
    .value(function(d) {return d.count;});

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transofrm", "translate(" +width/2  + "," +height/2 +")")

d3.csv("data.csv", function(error, data) {
    if(error) throw error;

    data.forEach(function(d) {
        d.grade = d.grade;
        d.recordCount = +d.recordCount;
    })
    
}) 
