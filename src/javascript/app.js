var angular = require('angular');
var ngRoute = require('angular-route');
var TwitchModule = require('./components/twitchApi/twitch');
var CustomFilters = require('./components/customFilters/customFilters');
var GamesCtrl = require('./app/games.controller');

var app = angular.module('testApp', ['ngRoute', CustomFilters.name, TwitchModule.name]);

app.controller('GamesCtrl', GamesCtrl);

// routes
app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/templates/games.html',
      controller: 'GamesCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

angular.bootstrap(document.body, [app.name]);
