window.onload=function(){
var w = 1400;
var h = 70;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


var dataset = [ 
    { key: 0, value: 5 },
    { key: 1, value: 10 },
    { key: 2, value: 13 },
    { key: 3, value: 19 },
    { key: 4, value: 21 },
    { key: 5, value: 25 },
    { key: 6, value: 22 },
    { key: 7, value: 18 },
    { key: 8, value: 15 },
    { key: 9, value: 13 },
    { key: 10, value: 11 },
    { key: 11, value: 12 },
    { key: 12, value: 15 },
    { key: 13, value: 20 },
    { key: 14, value: 18 },
    { key: 15, value: 17 },
    { key: 16, value: 16 },
    { key: 17, value: 18 },
    { key: 18, value: 23 },
    { key: 19, value: 25 },
    { key: 20, value: 5 },
    { key: 21, value: 10 },
    { key: 22, value: 13 },
    { key: 23, value: 19 },
    { key: 24, value: 21 },
    { key: 25, value: 25 },
    { key: 26, value: 22 },
    { key: 27, value: 18 },
    { key: 28, value: 15 },
    { key: 29, value: 13 },
    { key: 30, value: 11 },
    { key: 31, value: 12 },
    { key: 32, value: 15 },
    { key: 33, value: 20 },
    { key: 34, value: 18 },
    { key: 35, value: 17 },
    { key: 36, value: 16 },
    { key: 37, value: 18 },
    { key: 38, value: 23 },
    { key: 39, value: 25 },
     { key: 40, value: 5 },
    { key: 41, value: 10 },
    { key: 42, value: 13 },
    { key: 43, value: 19 },
    { key: 44, value: 21 },
    { key: 45, value: 25 },
    { key: 46, value: 22 },
    { key: 47, value: 18 },
    { key: 48, value: 15 },
    { key: 49, value: 13 },
    { key: 50, value: 11 },
    { key: 51, value: 12 },
    { key: 52, value: 15 },
    { key: 53, value: 20 },
    { key: 54, value: 18 },
    { key: 55, value: 17 },
    { key: 56, value: 16 },
    { key: 57, value: 18 },
    { key: 58, value: 23 },
    { key: 59, value: 25 },
    { key: 60, value: 18 },
    { key: 61, value: 17 },
    { key: 62, value: 16 },
    { key: 63, value: 18 },
    { key: 64, value: 23 },
    { key: 65, value: 25 },
     { key: 66, value: 5 },
    { key: 67, value: 10 },
    { key: 68, value: 13 },
    { key: 69, value: 19 },
    { key: 70, value: 21 },
    { key: 71, value: 25 },
    { key: 72, value: 22 },
    { key: 73, value: 18 },
    { key: 74, value: 15 },
    { key: 75, value: 13 },
    { key: 76, value: 11 },
    { key: 77, value: 12 },
    { key: 78, value: 15 },
    { key: 79, value: 20 },
    { key: 80, value: 18 },
    { key: 81, value: 17 },
    { key: 82, value: 16 },
    { key: 83, value: 18 },
    { key: 84, value: 23 },
    { key: 85, value: 25 } ];

var xScale = d3.scale.ordinal()
                .domain(d3.range(dataset.length))
                .rangeRoundBands([0, w], 0.05); 

var yScale = d3.scale.linear()
                .domain([0, d3.max(dataset, function(d) {return d.value;})])
                .range([0, h]);

var key = function(d) {
    return d.key;
};

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
  })

//Create SVG element
var svg = d3.select("#bar-chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.call(tip);

//Create bars
svg.selectAll("rect")
   .data(dataset, key)
   .enter()
   .append("rect")
   .attr("x", function(d, i) {
        return xScale(i);
   })
   .attr("y", function(d) {
        return h - yScale(d.value);
   })
   .attr("width", xScale.rangeBand())
   .attr("height", function(d) {
        return yScale(d.value);
   })
   .style("fill", function(d, i) { return z(i); })
  /*  .attr("fill", function(d) {
        return "rgb(0, 0, " + (d.value * 10) + ")";
   })*/
    .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    //Tooltip
    .on("mouseover", function(d) {
        //Get this bar's x/y values, then augment for the tooltip
        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
        var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
        
        //Update Tooltip Position & value
        d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#value")
            .text(d.value);
        d3.select("#tooltip").classed("hidden", false)
    })
    .on("mouseout", function() {
        //Remove the tooltip
        d3.select("#tooltip").classed("hidden", true);
    })  ;


   
var sortOrder = false;
var sortBars = function () {
    sortOrder = !sortOrder;
    
    sortItems = function (a, b) {
        if (sortOrder) {
            return a.value - b.value;
        }
        return b.value - a.value;
    };

    svg.selectAll("rect")
        .sort(sortItems)
        .transition()
        .delay(function (d, i) {
        return i * 50;
    })
        .duration(1000)
        .attr("x", function (d, i) {
        return xScale(i);
    });

    svg.selectAll('text')
        .sort(sortItems)
        .transition()
        .delay(function (d, i) {
        return i * 50;
    })
        .duration(1000)
        .text(function (d) {
        return d.value;
    })
        .attr("text-anchor", "middle")
        .attr("x", function (d, i) {
        return xScale(i) + xScale.rangeBand() / 2;
    })
        .attr("y", function (d) {
        return h - yScale(d.value) + 14;
    });
};
// Add the onclick callback to the button
d3.select("#sort").on("click", sortBars);
d3.select("#reset").on("click", reset);
function randomSort() {

    
    svg.selectAll("rect")
        .sort(sortItems)
        .transition()
        .delay(function (d, i) {
        return i * 50;
    })
        .duration(1000)
        .attr("x", function (d, i) {
        return xScale(i);
    });

    svg.selectAll('text')
        .sort(sortItems)
        .transition()
        .delay(function (d, i) {
        return i * 50;
    })
        .duration(1000)
        .text(function (d) {
        return d.value;
    })
        .attr("text-anchor", "middle")
        .attr("x", function (d, i) {
        return xScale(i) + xScale.rangeBand() / 2;
    })
        .attr("y", function (d) {
        return h - yScale(d.value) + 14;
    });
}
function reset() {
    svg.selectAll("rect")
        .sort(function(a, b){
            return a.key - b.key;
        })
        .transition()
        .delay(function (d, i) {
        return i * 50;
        })
        .duration(1000)
        .attr("x", function (d, i) {
        return xScale(i);
        });
        
    svg.selectAll('text')
        .sort(function(a, b){
            return a.key - b.key;
        })
        .transition()
        .delay(function (d, i) {
        return i * 50;
    })
        .duration(1000)
        .text(function (d) {
        return d.value;
    })
        .attr("text-anchor", "middle")
        .attr("x", function (d, i) {
        return xScale(i) + xScale.rangeBand() / 2;
    })
        .attr("y", function (d) {
        return h - yScale(d.value) + 14;
    });
};
}//]]>  
