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

  ctrl._twitch.get('games/top').then(function(data) {
    console.log(data);
    ctrl._scope.games = data.top;
  });
};

module.exports = appController;
