var angular = require('angular');

var TwitchService = require('./twitch.service');

var twitchModule = angular.module('TwitchModule', []);
twitchModule.service('Twitch', TwitchService);

module.exports = twitchModule;
