var angular = require('angular');
var GamesController = require('./games.controller');

var d3 = require('d3');

var appDirective = function($window) {
  return {
    restrict: 'EA',
    scope: {

    },
    controller: GamesController,
    link: function(scope, element, attrs, ctrl) {

        ctrl.init(element);

        angular.element(window).on('resize', ctrl.handleWindowResize.bind(ctrl));

    },
    replace: true,
    templateUrl: '/templates/gameChart.html'
  };
};
appDirective.$inject = ['$window'];
appDirective.DIRECTIVE_NAME = 'games';

module.exports = appDirective;

