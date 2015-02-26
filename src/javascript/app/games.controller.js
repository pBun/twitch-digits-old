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
    'gameLimit': 100,
    'streamLimit': 100
  }).then(function(gameData) {
    this.scope.gameData = gameData;
    this.buildChart(gameData);
    this.chart.ready = true;
  }.bind(this));

};

appController.prototype.initChart = function(el) {
  var chart = this.chart;
  chart.wrapper = el && el.length ? el[0] : chart.wrapper;

  chart.width = chart.wrapper.offsetWidth;
  chart.height = chart.wrapper.offsetHeight;
  chart.radius = Math.min(chart.width, chart.height) / 2;

  // make `colors` an ordinal scale
  chart.colors = chart.colors || d3.scale.category20();

  chart.visWrapper = (chart.visWrapper || d3.select(chart.wrapper).append('svg:svg'))
      .attr('width', chart.width)
      .attr('height', chart.height);

  chart.vis = (chart.vis || chart.visWrapper.append('svg:g'))
      .attr('id', 'container')
      .attr('transform', 'translate(' + chart.width / 2 + ',' + chart.height / 2 + ')');

  chart.partition = (chart.partition || d3.layout.partition())
      .size([2 * Math.PI, 100])
      .value(function(d) { return d.viewers; });

  chart.arc = (chart.arc || d3.svg.arc())
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return chart.radius * Math.sqrt(d.y) / 10; })
      .outerRadius(function(d) { return chart.radius * Math.sqrt(d.y + d.dy) / 10; });

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  chart.bounds = (chart.bounds || chart.vis.append('svg:circle'))
      .attr('r', chart.radius)
      .style('opacity', 0);

};

appController.prototype.handleWindowResize = function(e) {
  this.initChart();
  this.buildChart(this.scope.gameData);
};

appController.prototype.buildChart = function(chartData) {

  var chart = this.chart;
  var scope = this.scope;

  // Total size of all segments; we set this later, after loading the data.
  chart.totalViewers = chartData.viewers;

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = chart.partition.nodes(chartData)
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

  chart.path = chart.vis.data([chartData]).selectAll('path').data(nodes);

  chart.path.enter()
      .append('svg:path')
      .on('mouseover', mouseover)
      .on('click', click);

  chart.path
    .attr('display', function(d) { return d.depth ? null : 'none'; })
    .attr('d', chart.arc)
    .attr('fill-rule', 'evenodd')
    .style('fill', function(d) { return chart.colors(d.name); });

  chart.path.exit()
    .remove();

  // Add the mouseleave handler to the bounding circle.
  chart.vis.on('mouseleave', mouseleave);

  chart.viewers = chart.path.node().__data__.value;

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

  function click(d) {
    window.open(d.url);
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

};


module.exports = appController;

