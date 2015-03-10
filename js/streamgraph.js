function chart(filePath, color) {
    $("#chart").empty();
    var datearray = [];
    var colorrange = [];
    if (color == "blue") {
        colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
    }
    else if (color == "pink") {
        colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
    }
    else if (color == "orange") {
        colorrange = ["#E34A33", "#B30000", "#ffe7db", "#027837", "#02652e", "#FEF0D9"];
    }

    strokecolor = colorrange[0];
    var format = d3.time.format("%H:%M:%S,%L");
    var margin = {top: 20, right: 40, bottom: 30, left: 30};
    var width = 1000;//document.body.clientWidth - margin.left - margin.right;
    var height = 20; 
    //- margin.top - margin.bottom;

    var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

    var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);


    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "20")
        .style("visibility", "hidden")
        .style("top", "30px")
        .style("left", "55px");
    var x = d3.time.scale()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height-10, 0]);
    var z = d3.scale.ordinal()
        .range(colorrange);
    var xTicks = d3.scale.linear()
        .range([0, width])
        .domain([0, 1]);
    var yTicks = d3.scale.linear()
        .range([height-10, 0])
        .domain([-1, 1]);
    var formatPercent = d3.format(".0%");
    var xAxis = d3.svg.axis()
        .scale(xTicks)
        .orient("bottom")
        .tickFormat(formatPercent);
    var yAxis = d3.svg.axis()
        .scale(yTicks);
    var yAxisr = d3.svg.axis()
        .scale(y);
    var stack = d3.layout.stack()
        .offset("silhouette")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date[0]; })
        .y(function(d) { return d.value; });
    var nest = d3.nest()
        .key(function(d) { return d.key; });
    var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date[0]); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });


    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    var graph = d3.csv(filePath, function(data) {
        data.forEach(function(d) {
            var lower=format.parse(d.timestamp.split(" --> ")[0]);
            //console.log(lower);
            var upper=format.parse(d.timestamp.split(" --> ")[1]);
            //console.log(upper);
            d.date = [lower,upper];
            // console.log(d.date);
            // console.log(d.date[0]);   
            d.value = +d.value;
        });
        var layers = stack(nest.entries(data));
        x.domain(d3.extent(data, function(d) { return d.date[1]; }));
        console.log(x.domain());
        y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

        svg.selectAll(".layer")
            .data(layers)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function(d) {return area(d.values); })
            .style("fill", function(d, i) { return z(i); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ", 0)");
            // .call(yAxis.orient("right"));
        svg.append("g")
                .attr("class", "y axis");
                // .call(yAxis.orient("left"));
        svg.selectAll(".layer")
            .attr("opacity", 1)
            .on("mouseover", function(d, i) {
                svg.selectAll(".layer")
                    .transition()
                    .duration(250)
                    .attr("opacity", function(d, j) {
                        return j != i ? 0.6 : 1;
                    })})
            .on("mousemove", function(d, i) {
                mousex = d3.mouse(this);
                mousex = mousex[0];
                console.log(mousex);

                var invertedx = x.invert(mousex);
                console.log(invertedx);

                var selected = (d.values);
                
                for (var k = 0; k < selected.length; k++) {

                    if((invertedx >= selected[k].date[0])&&(invertedx <= selected[k].date[1])){
                        pro = d.values[k].value;
                        set = d.values[k].sentence;
                    }
                }

                //console.log(datearray[9]);
                //mousedate = datearray.indexOf(invertedx);
                // console.log(mousedate);

                // pro = d.values[mousedate].value;
                // set = d.values[mousedate].sentence;
                d3.select(this)
                    .classed("hover", true)
                    .attr("stroke", strokecolor)
                    .attr("stroke-width", "0.5px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "<br/>"+set+"</p>" ).style("visibility", "visible");
            })
            .on("mouseout", function(d, i) {
                svg.selectAll(".layer")
                    .transition()
                    .duration(250)
                    .attr("opacity", "1");
                d3.select(this)
                    .classed("hover", false)
                    .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "<br/>"+set+"</p>" ).style("visibility", "hidden");
            });
        var vertical = d3.select("#chart")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "19")
            .style("width", "1px")
            .style("height", "380px")
            .style("top", "10px")
            .style("bottom", "30px")
            .style("left", "0px")
            .style("background", "#fff")
                        .call(drag);
        d3.select("#chart")
            .on("mousemove", function(){  
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px" )})
            .on("mouseover", function(){  
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px")
            });
    });

function dottype(d) {
  d.x = +d.x;
  d.y = +d.y;
  return d;
}
function zoomed() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}
}