// Draw Bar Chart
function drawBarChart() {

    var svg = d3.select("#old"),
    margin = {top: 40, right: 70, bottom: 40, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var formatPercent = d3.format("%")

    var z = d3.scaleOrdinal()
        .range(["#cc00cc", "#5200cc","#98abc5", "#8a89a6", "#7b6888"]);
        //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    d3.csv("rural_urban.csv", function(d, i, columns) {
            for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
            //console.log(d)
            return d;
        }, function(error, data) {
            if (error) throw error;

            var keys = data.columns.slice(1);

            x0.domain(data.map(function(d) { return d.State; }));
            x1.domain(keys).rangeRound([0, x0.bandwidth()]);
            y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

            g.append("g")
                .selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                .attr("x", function(d) { return x1(d.key); })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", x1.bandwidth())
                .attr("height", function(d) { return height - y(d.value); })
                .attr("fill", function(d) { return z(d.key); })
                .on("mousemove", function(d){
                    tooltip
                      .style("left", d3.event.pageX - 10 + "px")
                      .style("top", d3.event.pageY - 50 + "px")
                      .style("display", "inline-block")
                      .style("font-size","13px")
                      .html((d.key) + "<br>" +(d.value)+ " %");
                })
                    .on("mouseout", function(d){ tooltip.style("display", "none");});



            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x0));
                //.dtickFormat(percent)

            g.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks(null, "s"))
                .call(d3.axisLeft(y).tickFormat(d => d+"%"))
                .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                //.text("Performance - Rural Urban");


            g.append("g")
                .append('text')
                .attr('class', 'label')
                .attr('x', -(height) - margin)
                .attr('y', margin)
                .attr('transform', 'rotate(-90) translate(-96 -50)')
                .attr('text-anchor', 'end')
                .text('Number of Students (%)')
                .style("font-size","15px");

            g.append('text')
                .attr('x', width / 2 + margin)
                .attr('y', 40)
                .attr('transform', 'translate(200 470)')
                .attr('text-anchor', 'middle')
                .text('Grades')
                .style("font-size","15px");

            var legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 13)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", z);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) { return d; });
            });
} // drawBarChart

drawBarChart()