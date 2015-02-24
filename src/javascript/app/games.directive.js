var angular = require('angular');
var GamesController = require('./games.controller');
var GamesTemplate = require('./games.html');
var d3 = require('d3');

var appDirective = function($window) {
  return {
    restrict: 'EA',
    scope: {

    },
    controller: GamesController,
    link: function(scope, element, attrs, ctrl) {

    },
    replace: true,
    template: GamesTemplate
  };
};
appDirective.$inject = ['$window'];
appDirective.DIRECTIVE_NAME = 'games';

module.exports = appDirective;
