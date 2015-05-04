var angular = require('angular');
var GamesController = require('./games.controller');
var GamesChartTemplate = require('html!./gamesChart.template.html');

var d3 = require('d3');

var appDirective = function($window) {
  return {
    restrict: 'EA',
    scope: {
        refresh: '=?',
        ready: '=?',
        gameLimit: '=?',
        gameOffset: '=?',
        streamLimit: '=?',
        efficiency: '=?',
        error: '=?'
    },
    controller: GamesController,
    link: function(scope, element, attrs, ctrl) {

        ctrl.init(element);

        angular.element(window).on('resize', ctrl.handleWindowResize.bind(ctrl));
    },
    replace: true,
    template: GamesChartTemplate
  };
};
appDirective.$inject = ['$window'];
appDirective.DIRECTIVE_NAME = 'games';

module.exports = appDirective;

