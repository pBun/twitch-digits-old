var angular = require('angular');

var appController = function($scope) {

  this.scope = $scope;

  this.scope.chart = {};
  this.scope.chart.gameLimit = 100;
  this.scope.chart.streamLimit = 100;
  this.scope.chart.refresh = false;
  this.scope.chart.ready;

};
appController.$inject = ['$scope'];


module.exports = appController;
