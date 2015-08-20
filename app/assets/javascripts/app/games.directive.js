var angular = require('angular');
var GamesController = require('./games.controller');
var GamesChartTemplate = require('html!./gamesChart.template.html');

var appDirective = function($window) {
  return {
    restrict: 'EA',
    scope: {
        refresh: '=?',
        ready: '=?',
        gameLimit: '=?',
        gameOffset: '=?',
        streamLimit: '=?',
        gameName: '=?',
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

