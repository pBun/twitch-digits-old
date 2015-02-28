var angular = require('angular');
var TwitchModule = require('./components/twitchApi/twitch');
var CustomFilters = require('./components/customFilters/customFilters');
var MainController = require('./app/main.controller');
var GamesService = require('./app/games.service');
var GamesDirective = require('./app/games.directive');

var app = angular.module('twitchDigits', [CustomFilters.name, TwitchModule.name]);
app.controller('MainController', MainController);
app.service('Games', GamesService);
app.directive(GamesDirective.DIRECTIVE_NAME, GamesDirective);

angular.bootstrap(document.body, [app.name]);
