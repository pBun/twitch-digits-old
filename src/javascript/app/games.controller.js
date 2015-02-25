var angular = require('angular');

var appController = function($scope, Games) {

  this._scope = $scope;
  this._games = Games;

};
appController.$inject = ['$scope', 'Games'];

appController.prototype.init = function(el) {

  ctrl = this;

  ctrl._scope = {};

  ctrl._games.getGames({
    'gameLimit': 10,
    'streamLimit': 5
  }).then(function(games) {
    this.buildChart(el, games);
  }.bind(this));

};

appController.prototype.buildChart = function(el, games) {
  var chartData = angular.copy(games);
  var width = el[0].offsetWidth;
  var height = el[0].offsetHeight;
  var radius = Math.min(width, height) / 2;

  var x = d3.scale.linear().range([0, 2 * Math.PI]);
  var y = d3.scale.sqrt().range([0, radius]);

  var color = d3.scale.category20c();

  var svg = d3.select(el[0]).append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + (height / 2) + ')');

  var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return 1; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

  // Keep track of the node that is currently being displayed as the root.
  var node;

  // d3.json('/d/4063550/flare.json', function(error, chartData) {
  var nodes = partition.nodes({children: chartData});
  var node = chartData;
  var path = svg.datum(chartData).selectAll('path')
      .data(partition.nodes)
    .enter().append('path')
      .attr('d', arc)
      .attr('data-name', function(d) { return d.name; })
      .attr('data-viewers', function(d) { return d.viewers; })
      .style('fill', function(d) { return color((d.children ? d : d.parent).name); })
      .on('click', click)
      .each(stash);

    path
        .data(partition.value(function(d) {
          return d.viewers;
        }).nodes)
      .transition()
        .duration(1000)
        .attrTween('d', arcTweenData);
  // });

  var text = d3.select('body').selectAll('text').data(nodes);
  var textEnter = text.enter().append('text')
      .style('fill-opacity', 1)
      .style('fill', function(d) {
        return brightness(d3.rgb(color(d))) < 125 ? '#eee' : '#000';
      })
      .attr('text-anchor', function(d) {
        return x(d.x + d.dx / 2) > Math.PI ? 'end' : 'start';
      })
      .attr('dy', '.2em')
      .attr('transform', function(d) {
        var multiline = (d.name || '').split(' ').length > 1,
            angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
            rotate = angle + (multiline ? -.5 : 0);
        return 'rotate(' + rotate + ')translate(' + (y(d.y) + 0) + ')rotate(' + (angle > 90 ? -180 : 0) + ')';
      })
      .on('click', click);
  textEnter.append('tspan')
      .attr('x', 0)
      .text(function(d) { return d.depth ? d.name.split(' ')[0] : ''; });
  textEnter.append('tspan')
      .attr('x', 0)
      .attr('dy', '1em')
      .text(function(d) { return d.depth ? d.name.split(' ')[1] || '' : ''; });

  function click(d) {
    node = d;
    path.transition()
      .duration(1000)
      .attrTween('d', arcTweenZoom(d));
  }
// });

  d3.select(self.frameElement).style('height', height + 'px');

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
      return arc(b);
    }
    if (i == 0) {
     // If we are on the first arc, adjust the x domain to match the chartData node
     // at the current zoom level. (We only need to do this once.)
      var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
      return function(t) {
        x.domain(xd(t));
        return tween(t);
      };
    } else {
      return tween;
    }
  }

  // When zooming: interpolate the scales.
  function arcTweenZoom(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
      return i
          ? function(t) { return arc(d); }
          : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
  }

  // http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
  function brightness(rgb) {
    return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
  }
};

module.exports = appController;
