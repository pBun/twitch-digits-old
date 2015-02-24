var angular = require('angular');
var ngRoute = require('angular-route');
var TwitchModule = require('./components/twitchApi/twitch');
var CustomFilters = require('./components/customFilters/customFilters');
var GamesService = require('./app/games.service');
var GamesDirective = require('./app/games.directive');

var app = angular.module('testApp', ['ngRoute', CustomFilters.name, TwitchModule.name]);
app.service('Games', GamesService);
app.directive(GamesDirective.DIRECTIVE_NAME, GamesDirective);

// routes
app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/templates/games.html'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

angular.bootstrap(document.body, [app.name]);
