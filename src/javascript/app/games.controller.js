var angular = require('angular');

var appController = function($scope, Twitch) {

  this._scope = $scope;
  this._twitch = Twitch;

  this.init();

};
appController.$inject = ['$scope', 'Twitch'];

appController.prototype.init = function() {

  ctrl = this;

  ctrl._scope = ctrl._scope || {};

  ctrl._scope.games = [];

  ctrl._twitch.get('streams/summary')
  .then(function(data) {
    ctrl._scope.streams = {};
    ctrl._scope.streams.viewers = data.viewers;
    ctrl._scope.streams.channels = data.channels;

    ctrl._twitch.get('games/top')
    .then(function(data) {
      ctrl._scope.games = data.top;
      console.log(data);
    });

  });

};

module.exports = appController;
