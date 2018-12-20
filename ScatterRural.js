var margin = { top: 90, right: 90, bottom: 90, left: 120 };
var width = 1000 - margin.left - margin.right;
var height = 650 - margin.top - margin.bottom;

var svgRuralFamEdu = d3.select("#chart-scatterRural")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xscale = d3.scaleLinear()
    .domain([-1,20])
    .range([0,width]);

var ticks = [0,1];
var tickLabels = ['Parent Uneducated','Parent Educated']

var yscale = d3.scaleLinear()
    .domain([-1,2])
    .range([height,0]);

var radius = d3.scaleSqrt()
    .range([5,12]);

var xAxis = d3.axisBottom()
    .tickSize(-5)
    .scale(xscale)
    .ticks(10);
    
var yAxis = d3.axisLeft()
    .tickSize(-width)
    .scale(yscale)
    .ticks(3)   //https://stackoverflow.com/questions/42058460/d3-scatter-plot-y-axis-numbers-display-incomplete
    .tickValues(ticks)   // https://stackoverflow.com/questions/44872048/d3-js-how-can-i-create-an-axis-with-custom-labels-and-customs-ticks
    .tickFormat(function(d,i){ return tickLabels[i] });

var color = d3.scaleCategory20();

d3.csv("ParentEduRrual.csv", function(error, data) {
    console.log(data);
    // data pre-processing
    data.forEach(function(d) {
    d.y = +d["Fedu"];
    d.x = +d["G31"];
    d.r = +d["Number of Records"];
    });

    //data.sort(function(a,b) { return b.r - a.r; });
/*
    yscale.domain(d3.extent(data, function(d) {
    return d.y;
    })).nice();
*/
    radius.domain(d3.extent(data, function(d) {
    return d.r;
    })).nice();

    svgRuralFamEdu.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis")
    .call(xAxis);

    svgRuralFamEdu.append("g")
    .attr("transform", "translate(0,0)")
    .attr("class", "y axis")
    .call(yAxis);

    var group = svgRuralFamEdu.selectAll("g.bubble")
    .data(data)
    .enter().append("g")
    .attr("class", "bubble")
    .attr("transform", function(d) {
        return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")"
    });

    //++ interactive feature - chekboxes
    //http://plnkr.co/edit/MkZcXJPS7hrcWh3M0MZ1?p=preview
    d3.selectAll("[name=v]").on("change", function() {
        var selectedParentEducation = this.value;
        display = this.checked ? "inline" : "none";
  
  
        svgRuralFamEdu.selectAll("g.bubble")
            .filter(function(d) {return selectedParentEducation == d.Fedu;})
            .attr("display", display);
    });
    //-- interactive feature - chekboxes

    group
    .append("circle")
    .attr("r", function(d) { return radius(d.r*5);  })
    .style("fill", function(d) {
        return color();  //return color(d[""]);   return color(black);
    })
    /*
    group
    .append("text")
    .attr("x", function(d) { return radius(d.r); })
    .attr("alignment-baseline", "middle")
    .text(function(d) {
        return (Math.round(d["Number of Records"]*100)/100 + " %");  
    }); */

    svgRuralFamEdu.append("text")
    .attr("x", 6)
    .attr("y", -2)
    .attr("class", "label")
    .text("Rural - Parents' education and Grades")
    .style("font-size", "20px");

    svgRuralFamEdu.append('text')
    .attr('class', 'label')
    .attr("x", 0)   //middle        // .attr('x', -(height) - margin)
    .attr("y", height - margin.top*1.5)     // .attr('y', margin)
    .attr('transform', 'translate(480 180)')
    .attr('text-anchor', 'end')
    .text('Grades')

    // -add vertical line

    // +add vertical line
    //source: https://stackoverflow.com/questions/26418777/draw-a-vertical-line-representing-the-current-date-in-d3-gantt-chart
    // Parent Educated
    svgRuralFamEdu.append("line")
        .attr("x1", 480)
        .attr("y1", height - margin.top*3.85)  //top point
        .attr("x2", 480)
        .attr("y2", height - margin.top*3.15) //bottom point
        .style("stroke-width", 3)
        .style("stroke", "red")
        .style("fill", "none");
    
    svgRuralFamEdu.append("text")
        .attr("x", 480)
        .attr("y", height - margin.top*3.9)
        .text("Median")
        .style("font-size", "10px");
    // -add vertical line

    // +add vertical line
    //source: https://stackoverflow.com/questions/26418777/draw-a-vertical-line-representing-the-current-date-in-d3-gantt-chart
    // Parent Uneducated
    svgRuralFamEdu.append("line")
        .attr("x1", 350)
        .attr("y1", height - margin.top*2.1)  //top point
        .attr("x2", 350)
        .attr("y2", height - margin.top*1.4) //bottom point
        .style("stroke-width", 3)
        .style("stroke", "red")
        .style("fill", "none");

    svgRuralFamEdu.append("text")
        .attr("x", 350)
        .attr("y", height - margin.top*2.15)
        .text("Median")
        .style("font-size", "10px");
    // -add vertical line

    
    /*
    var legend = svgRuralFamEdu.selectAll(".legend")
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
    */
    /*
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
    */
    
});
