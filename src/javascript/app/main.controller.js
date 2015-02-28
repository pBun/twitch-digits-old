var angular = require('angular');

var appController = function($scope) {

  this.scope = $scope;

  this.scope.chart = {};
  this.scope.chart.gameOffset = 0;
  this.scope.chart.gameLimit = 25;
  this.scope.chart.streamLimit = 0;
  this.scope.chart.efficiency = 0.1;
  this.scope.chart.refresh = false;
  this.scope.chart.ready;

};
appController.$inject = ['$scope'];


module.exports = appController;
