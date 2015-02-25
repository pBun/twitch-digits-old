var angular = require('angular');

var appController = function($scope, Games) {

  this._scope = $scope;
  this._games = Games;
  this._chart = {};

};
appController.$inject = ['$scope', 'Games'];

appController.prototype.init = function(el) {

  ctrl = this;

  ctrl._scope = {};

  // ctrl.initChart(el);

  ctrl._games.getGames({
    'gameLimit': 10,
    'streamLimit': 5
  }).then(function(games) {
    // this.buildChart(games);
    test(games);
  }.bind(this));

};

appController.prototype.initChart = function(el) {
  var chart = this._chart;
  chart.wrapper = el[0];
  chart.width = chart.wrapper.offsetWidth;
  chart.height = chart.wrapper.offsetHeight;
  chart.radius = Math.min(chart.width, chart.height) / 2;

  chart.x = d3.scale.linear().range([0, 2 * Math.PI]);
  chart.y = d3.scale.sqrt().range([0, chart.radius]);

  chart.color = d3.scale.category20c();

  chart.svg = d3.select(chart.wrapper).append('svg')
    .attr('width', chart.width)
    .attr('height', chart.height)
  .append('g')
    .attr('transform', 'translate(' + chart.width / 2 + ',' + (chart.height / 2) + ')');

  chart.partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return 1; });

  chart.arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, d.y ? chart.y(d.y) : d.y); })
    .outerRadius(function(d) { return Math.max(0, chart.y(d.y + d.dy)); });

};

appController.prototype.buildChart = function(chartData) {

  var chart = this._chart;

  // d3.json('/d/4063550/flare.json', function(error, chartData) {
  var nodes = chart.partition.nodes({children: chartData});
  var path = chart.svg.datum(chartData).selectAll('path')
      .data(chart.partition.nodes)
    .enter().append('path')
      .attr('d', chart.arc)
      .attr('class', function(d) { return d.type; })
      .attr('data-name', function(d) { return d.name; })
      .attr('data-viewers', function(d) { return d.viewers; })
      .attr('data-image', function(d) { return d.image; })
      .style('fill', function(d) { return chart.color((d.type === 'stream' ? d.parent : d).name); })
      .on('click', click)
      .each(stash);

  path
    .append('text').attr('class', 'name')
      .text(function(d) {
        return d.name;
      });

  path
      .data(chart.partition.value(function(d) {
        return d.viewers;
      }).nodes)
    .transition()
      .duration(1000)
      .attrTween('d', arcTweenData);
  // });

  function click(d) {
    node = d;
    path.transition()
      .duration(1000)
      .attrTween('d', arcTweenZoom(d));
  }
// });

  d3.select(self.frameElement).style('height', chart.height + 'px');

  // Setup for switching data: stash the old values for transition.
  function stash(d) {
    d.x0 = d.x;
    d.dx0 = d.dx;
  }

  // When switching data: interpolate the arcs in data space.
  function arcTweenData(a, i) {
    var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
    function tween(t) {
      var b = oi(t);
      a.x0 = b.x;
      a.dx0 = b.dx;
      return chart.arc(b);
    }
    if (i == 0) {
     // If we are on the first arc, adjust the x domain to match the chartData node
     // at the current zoom level. (We only need to do this once.)
      var xd = d3.interpolate(chart.x.domain(), [chartData.x, chartData.x + chartData.dx]);
      return function(t) {
        chart.x.domain(xd(t));
        return tween(t);
      };
    } else {
      return tween;
    }
  }

  // When zooming: interpolate the scales.
  function arcTweenZoom(d) {
    var xd = d3.interpolate(chart.x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(chart.y.domain(), [d.y, 1]),
        yr = d3.interpolate(chart.y.range(), [d.y ? 20 : 0, chart.radius]);
    return function(d, i) {
      return i
          ? function(t) { return chart.arc(d); }
          : function(t) { chart.x.domain(xd(t)); chart.y.domain(yd(t)).range(yr(t)); return chart.arc(d); };
    };
  }

  // http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
  function brightness(rgb) {
    return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
  }
};

function test(json) {
// Dimensions of sunburst.
var width = 550;
var height = 550;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 275, h: 30, s: 3, t: 10
};

// make `colors` an ordinal scale
var colors = d3.scale.category20();

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .size([2 * Math.PI, 100])
    .value(function(d) { return d.viewers; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return radius * Math.sqrt(d.y) / 10; })
    .outerRadius(function(d) { return radius * Math.sqrt(d.y + d.dy) / 10; });

createVisualization(json);

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

    // Basic setup of page elements.
    initializeBreadcrumbTrail();

    d3.select("#togglelegend").on("click", toggleLegend);

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(json)
        .filter(function(d) {
            return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
        });

    var uniqueNames = (function(a) {
        var output = [];
        a.forEach(function(d) {
            if (output.indexOf(d.name) === -1) {
                output.push(d.name);
            }
        });
        return output;
    })(nodes);

    // set domain of colors scale based on data
    colors.domain(uniqueNames);

    // make sure this is done after setting the domain
    drawLegend();

    var path = vis.data([json]).selectAll("path")
        .data(nodes)
       .enter()
        .append("svg:path")
        .attr("display", function(d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function(d) { return colors(d.name); })
        .style("opacity", 1)
        .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.node().__data__.value;
};

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  d3.select("#percentage")
      .text(percentageString);

  d3.select("#explanation")
      .style("visibility", "");

  var sequenceArray = getAncestors(d);
  updateBreadcrumbs(sequenceArray, percentageString);

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  d3.select("#explanation")
      .transition()
      .duration(1000)
      .style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors(d.name); });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 250, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      .attr("height", colors.domain().length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(colors.domain())
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return colors(d); });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d; });
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
    var foundChild = false;
    for (var k = 0; k < children.length; k++) {
      if (children[k]["name"] == nodeName) {
        childNode = children[k];
        foundChild = true;
        break;
      }
    }
  // If we don't already have a child node for this branch, create it.
    if (!foundChild) {
      childNode = {"name": nodeName, "children": []};
      children.push(childNode);
    }
    currentNode = childNode;
      } else {
    // Reached the end of the sequence; create a leaf node.
    childNode = {"name": nodeName, "viewers": viewers};
    children.push(childNode);
      }
    }
  }
  return root;
};


}


module.exports = appController;
