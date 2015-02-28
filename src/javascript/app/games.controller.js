var angular = require('angular');

var colorbrewer = require('../vendor/colorbrewer');

var appController = function($scope, Games) {

  this.scope = $scope;
  this._games = Games;

};
appController.$inject = ['$scope', 'Games'];

appController.prototype.init = function(el) {

  // Set scope variables
  this.scope.gameData = {};
  this.scope.chart = this.chart = {};

  this.initChart(el);
  this.refreshChartData();

  this.scope.$watch('refresh', function(newVal) {
    if (newVal && this.scope.ready) {
      this.refreshChartData();
      this.scope.refresh = false;
    }
  }.bind(this));

};

appController.prototype.refreshChartData = function() {
  this.scope.ready = false;
  this._games.getSnapshot({
    'gameOffset': this.scope.gameOffset,
    'gameLimit': this.scope.gameLimit,
    'streamLimit': this.scope.streamLimit
  }).then(function(gameData) {
    this.scope.gameData = gameData;
    this.buildChart(gameData);
    this.scope.ready = true;
  }.bind(this),
  function(error) {
    console.log('ERROR: ' + error);
    this.scope.ready = true;
  }.bind(this));
};

appController.prototype.handleWindowResize = function(e) {
  this.initChart();
  this.buildChart(this.scope.gameData);
};

appController.prototype.initChart = function(el) {
  var chart = this.chart;
  chart.wrapper = el && el.length ? el[0] : chart.wrapper;

  var parentEl = chart.wrapper.parentNode;
  var parentDim = Math.min(parentEl.offsetWidth, parentEl.offsetHeight);
  chart.width = parentDim;
  chart.height = parentDim;
  chart.radius = parentDim / 2;

  // set up x / y scale vars for zoom
  chart.x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

  chart.y = d3.scale.sqrt()
    .range([0, chart.radius]);

  // make `colors` an ordinal scale
  chart.colors = chart.colors || d3.scale.ordinal()
    .range(colorbrewer.Spectral[11]);

  chart.visWrapper = (chart.visWrapper || d3.select(chart.wrapper).append('svg:svg'))
      .attr('class', 'chart')
      .attr('width', chart.width)
      .attr('height', chart.height);

  chart.vis = (chart.vis || chart.visWrapper.append('svg:g'))
      .attr('id', 'container')
      .attr('transform', 'translate(' + chart.width / 2 + ',' + chart.height / 2 + ')');

  chart.partition = (chart.partition || d3.layout.partition())
      // .size([2 * Math.PI, 100])
      .value(function(d) { return d.viewers; });

  chart.arc = (chart.arc || d3.svg.arc())
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, chart.x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, chart.y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, chart.y(d.y + d.dy)); });

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  chart.bounds = (chart.bounds || chart.vis.append('svg:circle'))
      .attr('r', chart.radius)
      .style('opacity', 0);

};

appController.prototype.buildChart = function(chartData) {

  var chart = this.chart;
  var scope = this.scope;

  // Keep track of current root
  chart.root = chartData;

  chart.totalViewers = chartData.viewers;

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = chart.partition.nodes(chart.root)
      .filter(function(d) {
          if (d.type === 'root') return true;

          // hide anything below 0.01% by default
          var efficiency = (scope.efficiency || 0.01) / 100;

          if (d.type === 'stream') {
            return d.viewers / d.parent.viewers > efficiency && d.parent.viewers / chart.totalViewers > efficiency;
          }

          return d.viewers / chart.totalViewers > efficiency;
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

  chart.path.exit()
    .remove();

  chart.path.enter()
      .append('svg:path')
      .on('mouseover', this.mouseoverHandler.bind(this))
      .on('click', this.clickHandler.bind(this))
      .each(function(d) {
        // Setup for switching data: stash the old values for transition.
        d.x0 = d.x;
        d.dx0 = d.dx;
      });

  chart.path
    .attr('display', function(d) { return d.depth ? null : 'none'; })
    .attr('d', chart.arc)
    .attr('fill-rule', 'evenodd')
    .attr('class', function(d) { return d.type; })
    .style('fill', function(d) { return chart.colors(d.name); });

  // Add the mouseleave handler to the bounding circle.
  chart.vis.on('mouseleave', this.mouseleaveHandler.bind(this));

  // chart.viewers = chart.path.node().__data__.value;

};

// Fade all but the current sequence
appController.prototype.mouseoverHandler = function(d) {

  var chart = this.chart;
  var scope = this.scope;

  // Update current chart data
  scope.chart.current = d;
  scope.chart.currentGame = (d.type === 'stream') ? d.parent : d;
  scope.$apply();

  // Then highlight only those that are an ancestor of the current segment.
  var sequenceArray = this.getAncestors(d);
  chart.visWrapper
    .classed('active', true)
    .selectAll('path')
      .classed('current', false)
      .filter(function(d) {
        var isDirectlyActive = sequenceArray.indexOf(d) >= 0;
        var isChildOfActive = sequenceArray.indexOf(d.parent) >= 0;
        var isActive = d.type === 'stream' ? isDirectlyActive : (isDirectlyActive || isChildOfActive);
        return isActive;
      })
      .classed('current', true);
}

// Restore everything to full opacity when moving off the visualization.
appController.prototype.mouseleaveHandler = function(d) {

  var chart = this.chart;
  var scope = this.scope;

  // If we are zoomed, default to current game
  if (chart.zoomed) {
    chart.current = chart.currentGame;
    scope.$apply();
    return;
  }

  // Unset current chart data
  chart.current = null;
  chart.currentGame = null;
  scope.$apply();

  // Transition each segment to full opacity and then reactivate it.
  chart.visWrapper
    .classed('active', false)
    .selectAll('path')
      .classed('current', false);
}

appController.prototype.clickHandler = function(d) {

  var chart = this.chart;
  var scope = this.scope;

  var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  var isMobile = mobileRegex.test(navigator.userAgent);
  if (d.type === 'stream') {
    if (isMobile) {
      return;
    }
    window.open(d.url);
    return;
  }

  chart.root = chart.root === d && d.parent ? d.parent : d;
  var zooming = chart.root.type != 'root';
  clearTimeout(this.chart.zoomTimeout);
  chart.zoomed = zooming;
  scope.$apply();
  this.chart.zoomTimeout = setTimeout(function() {
    chart.visWrapper
      .classed('zoomed', zooming);
  }, zooming ? 0 : 800);
  chart.path.transition()
    .duration(1000)
    .attrTween("d", this.arcTweenZoom(chart.root));
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
appController.prototype.getAncestors = function(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

// When zooming: interpolate the scales.
appController.prototype.arcTweenZoom = function(d) {
  var chart = this.chart;
  var xd = d3.interpolate(chart.x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(chart.y.domain(), [d.y, 1])
      // yr = d3.interpolate(chart.y.range(), [d.y ? 20 : 0, chart.radius]);
  return function(d, i) {
    return i
        ? function(t) { return chart.arc(d); }
        : function(t) { chart.x.domain(xd(t)); chart.y.domain(yd(t)); return chart.arc(d); };
  };
};


module.exports = appController;

