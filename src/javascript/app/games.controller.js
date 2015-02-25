var angular = require('angular');

var appController = function($scope, Games) {

  this.scope = $scope;
  this._games = Games;

};
appController.$inject = ['$scope', 'Games'];

appController.prototype.init = function(el) {

  this.scope.gameData = {};
  this.chart = this.scope.chart = {};

  this.initChart(el);

  this._games.getGames({
    'gameLimit': 10,
    'streamLimit': 5
  }).then(function(gameData) {
    this.scope.gameData = gameData;
    this.buildChart(gameData, el);
  }.bind(this));

};

appController.prototype.initChart = function(el) {
  var chart = this.chart;
  chart.wrapper = el[0].querySelector('#main');

  chart.width = chart.wrapper.offsetWidth;
  chart.height = chart.wrapper.offsetHeight;
  chart.radius = Math.min(chart.width, chart.height) / 2;

  // make `colors` an ordinal scale
  chart.colors = d3.scale.category20();

  chart.vis = d3.select(chart.wrapper).append('svg:svg')
      .attr('width', chart.width)
      .attr('height', chart.height)
      .append('svg:g')
      .attr('id', 'container')
      .attr('transform', 'translate(' + chart.width / 2 + ',' + chart.height / 2 + ')');

  chart.partition = d3.layout.partition()
      .size([2 * Math.PI, 100])
      .value(function(d) { return d.viewers; });

  chart.arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return chart.radius * Math.sqrt(d.y) / 10; })
      .outerRadius(function(d) { return chart.radius * Math.sqrt(d.y + d.dy) / 10; });

};

appController.prototype.buildChart = function(chartData, el) {

  var chart = this.chart;
  var scope = this.scope;

  // Total size of all segments; we set this later, after loading the data.
  chart.totalViewers = chartData.viewers;

  createVisualization(chartData);

  // Main function to draw and set up the visualization, once we have the data.
  function createVisualization(json) {

      d3.select('#togglelegend').on('click', toggleLegend);

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      chart.vis.append('svg:circle')
          .attr('r', chart.radius)
          .style('opacity', 0);

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = chart.partition.nodes(json)
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
      chart.colors.domain(uniqueNames);

      // make sure this is done after setting the domain
      drawLegend();

      var path = chart.vis.data([json]).selectAll('path')
          .data(nodes)
         .enter()
          .append('svg:path')
          .attr('display', function(d) { return d.depth ? null : 'none'; })
          .attr('d', chart.arc)
          .attr('fill-rule', 'evenodd')
          .style('fill', function(d) { return chart.colors(d.name); })
          .on('mouseover', mouseover);

      // Add the mouseleave handler to the bounding circle.
      d3.select('#container').on('mouseleave', mouseleave);

      chart.viewers = path.node().__data__.value;

  };

  // Fade all but the current sequence
  function mouseover(d) {

    // Update current chart data
    scope.chart.current = d;
    scope.chart.currentGame = (d.type === 'stream') ? d.parent : d;
    scope.$apply();

    // Then highlight only those that are an ancestor of the current segment.
    var sequenceArray = getAncestors(d);
    chart.vis
      .classed('active', true)
      .selectAll('path')
        .classed('current', false)
        .filter(function(node) {
          return (sequenceArray.indexOf(node) >= 0);
        })
        .classed('current', true);
  }

  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {

    // Unset current chart data
    chart.current = null;
    chart.currentGame = null;
    scope.$apply();

    // Transition each segment to full opacity and then reactivate it.
    chart.vis
      .classed('active', false)
      .selectAll('path')
        .classed('current', false);
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

  function drawLegend() {

    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
    var li = {
      w: 250, h: 30, s: 3, r: 3
    };

    var legend = d3.select('#legend').append('svg:svg')
        .attr('width', li.w)
        .attr('height', chart.colors.domain().length * (li.h + li.s));

    var g = legend.selectAll('g')
        .data(chart.colors.domain())
        .enter().append('svg:g')
        .attr('transform', function(d, i) {
                return 'translate(0,' + i * (li.h + li.s) + ')';
             });

    g.append('svg:rect')
        .attr('rx', li.r)
        .attr('ry', li.r)
        .attr('width', li.w)
        .attr('height', li.h)
        .style('fill', function(d) { return chart.colors(d); });

    g.append('svg:text')
        .attr('x', li.w / 2)
        .attr('y', li.h / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(function(d) { return d; });
  }

  function toggleLegend() {
    var legend = d3.select('#legend');
    if (legend.style('visibility') == 'hidden') {
      legend.style('visibility', '');
    } else {
      legend.style('visibility', 'hidden');
    }
  }

  // Take a 2-column CSV and transform it into a hierarchical structure suitable
  // for a partition layout. The first column is a sequence of step names, from
  // root to leaf, separated by hyphens. The second column is a count of how
  // often that sequence occurred.
  function buildHierarchy(csv) {
    var root = {'name': 'root', 'children': []};
    for (var i = 0; i < csv.length; i++) {
      var sequence = csv[i][0];
      var size = +csv[i][1];
      if (isNaN(size)) { // e.g. if this is a header row
        continue;
      }
      var parts = sequence.split('-');
      var currentNode = root;
      for (var j = 0; j < parts.length; j++) {
        var children = currentNode['children'];
        var nodeName = parts[j];
        var childNode;
        if (j + 1 < parts.length) {
     // Not yet at the end of the sequence; move down the tree.
      var foundChild = false;
      for (var k = 0; k < children.length; k++) {
        if (children[k]['name'] == nodeName) {
          childNode = children[k];
          foundChild = true;
          break;
        }
      }
    // If we don't already have a child node for this branch, create it.
      if (!foundChild) {
        childNode = {'name': nodeName, 'children': []};
        children.push(childNode);
      }
      currentNode = childNode;
        } else {
      // Reached the end of the sequence; create a leaf node.
      childNode = {'name': nodeName, 'viewers': viewers};
      children.push(childNode);
        }
      }
    }
    return root;
  };

};


module.exports = appController;
