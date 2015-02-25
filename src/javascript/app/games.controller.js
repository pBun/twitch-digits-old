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

  ctrl.initChart(el);

  ctrl._games.getGames({
    'gameLimit': 10,
    'streamLimit': 5
  }).then(function(games) {
    this.buildChart(games);
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

module.exports = appController;
