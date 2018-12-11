

var margin = { top: 40, right: 90, bottom: 90, left: 90 };
var width = 1000 - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;

var svgFamEdu = d3.select("#chart-scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xscale = d3.scaleLinear()
    .domain([-1,20])
    .range([0,width]);

var yscale = d3.scaleLinear()
    .domain([-1,2])
    .range([height,0]);

var radius = d3.scaleSqrt()
    .range([5,12]);

var xAxis = d3.axisBottom(xscale)
    .tickSize(-height)
    .scale(xscale);

var yAxis = d3.axisLeft(yscale)
    .tickSize(-width)
    .scale(yscale)
    .ticks(3)   //https://stackoverflow.com/questions/42058460/d3-scatter-plot-y-axis-numbers-display-incomplete
    .tickValues([0,1])   // https://stackoverflow.com/questions/44872048/d3-js-how-can-i-create-an-axis-with-custom-labels-and-customs-ticks

var color = d3.scaleCategory20();

d3.csv("fedu.csv", function(error, data) {
    console.log(data);
    // data pre-processing
    data.forEach(function(d) {
    d.y = +d["Fedu"];
    d.x = +d["G31"];
    d.r = +d["Number of Records"];
    });

    data.sort(function(a,b) { return b.r - a.r; });
/*
    yscale.domain(d3.extent(data, function(d) {
    return d.y;
    })).nice();
*/
    radius.domain(d3.extent(data, function(d) {
    return d.r;
    })).nice();

    svgFamEdu.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis")
    .call(xAxis);

    svgFamEdu.append("g")
    .attr("transform", "translate(0,0)")
    .attr("class", "y axis")
    .call(yAxis);

    var group = svgFamEdu.selectAll("g.bubble")
    .data(data)
    .enter().append("g")
    .attr("class", "bubble")
    .attr("transform", function(d) {
        return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")"
    });

    group
    .append("circle")
    .attr("r", function(d) { return radius(d.r*5);  })
    .style("fill", function(d) {
        return color(d[""]);
    })

    group
    .append("text")
    .attr("x", function(d) { return radius(d.r); })
    .attr("alignment-baseline", "middle")
    .text(function(d) {
        return (Math.round(d["Number of Records"]*100)/100 + " %");  
    });

    svgFamEdu.append("text")
    .attr("x", 6)
    .attr("y", -2)
    .attr("class", "label")
    .text("Father's education and Grades");

    svgFamEdu.append('text')
    .attr('class', 'label')
    .attr('x', -(height) - margin)
    .attr('y', margin)
    .attr('transform', 'translate(480 180)')
    .attr('text-anchor', 'end')
    .text('Grades')

    // +add vertical line
    //source: https://stackoverflow.com/questions/26418777/draw-a-vertical-line-representing-the-current-date-in-d3-gantt-chart
    svgFamEdu.append("line")
        .attr("x1", 500)
        .attr("y1", height - margin.top*18.5)  //top point
        .attr("x2", 500)
        .attr("y2", height - margin.bottom*10.5) //bottom point
        .style("stroke-width", 3)
        .style("stroke", "red")
        .style("fill", "none");
    // -add vertical line

    // +add vertical line
    //source: https://stackoverflow.com/questions/26418777/draw-a-vertical-line-representing-the-current-date-in-d3-gantt-chart
    svgFamEdu.append("line")
        .attr("x1", 400)
        .attr("y1", height - margin.top*10.4)  //top point
        .attr("x2", 400)
        .attr("y2", height - margin.top*13.3) //bottom point
        .style("stroke-width", 3)
        .style("stroke", "red")
        .style("fill", "none");
    // -add vertical line


    var legend = svgFamEdu.selectAll(".legend")
        .data(color.domain())
    .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(2," + i * 14 + ")"; });

    legend.append("rect")
        .attr("x", width)
        //.attr("y", height)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", color);

    legend.append("text")
        .attr("x", width + 16)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

    legend.on("mouseover", function(type) {
        d3.selectAll(".legend")
        .style("opacity", 0.1);
        d3.select(this)
        .style("opacity", 1);
        d3.selectAll(".bubble")
        .style("opacity", 0.1)
        .filter(function(d) { return d["Number of Students"]; })
        .style("opacity", 1);
    })
    .on("mouseout", function(type) {
        d3.selectAll(".legend")
        .style("opacity", 1);
        d3.selectAll(".bubble")
        .style("opacity", 1);
    });

    
});
