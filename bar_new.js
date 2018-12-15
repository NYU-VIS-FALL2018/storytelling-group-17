var svg = d3.select("#total_bar"),
    margin = {top: 40, right: 40, bottom: 40, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleBand().rangeRound([0, width]).padding(0.4),
    y = d3.scaleLinear().rangeRound([height, 0]);
  
var colours = d3.scaleOrdinal()
    .range(["#6F257F", "#CA0D59"]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("total.json", function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.area; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        

    g.append("g")
        .attr("class", "axis axis--y")
        //.call(d3.axisLeft(y).tickFormat(d => d+"%").tickSizeInner([-width]
      	.call(d3.axisLeft(y).ticks(8).tickFormat(function(d) { return parseInt(d) + "%"; }).tickSizeInner([2]))
      .append("text")
        .attr("transform", "rotate(-90) translate(-70 -45)")
        .attr("y", 6)
       .attr("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Number of Students (%)")
        .style("font-size","15px");

    g.selectAll(".bar")
      	.data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.area); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return colours(d.area); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 10 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .style("font-size","13px")
              .html((d.area) + "<br>" + (d.value)+ " %");
        })
            .on("mouseout", function(d){ tooltip.style("display", "none");});
            
        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 13)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data("ABCD")
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", colours);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) { return d; });
    });