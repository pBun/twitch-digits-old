var angular = require('angular');
var ngRoute = require('angular-route');
var TwitchModule = require('./components/twitchApi/twitch');
var GamesCtrl = require('./app/games.controller');

var app = angular.module('testApp', ['ngRoute', TwitchModule.name]);

app.controller('GamesCtrl', GamesCtrl);

// routes
app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/templates/splash.html'
    }).
    when('/games', {
      templateUrl: '/templates/games.html',
      controller: 'GamesCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

angular.bootstrap(document.body, [app.name]);
