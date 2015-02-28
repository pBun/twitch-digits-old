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
  this.scope.calcRequests = this.calcRequests.bind(this);

};
appController.$inject = ['$scope'];

appController.prototype.calcRequests = function() {
    var chart = this.scope.chart;
    var rootViewerReqs = (chart.gameLimit || chart.streamLimit) ? 1 : 0;
    var gameReqs = chart.gameLimit < 100 ? 1 : Math.ceil(chart.gameLimit / 100);
    var streamReqs = chart.gameLimit;
    return rootViewerReqs + gameReqs + streamReqs;
};


module.exports = appController;
