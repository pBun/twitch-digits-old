var appController = function($scope) {

  this.scope = $scope;

  this.scope.chart = {};
  this.scope.chart.gameOffset = 0;
  this.scope.chart.gameLimit = 25;
  this.scope.chart.streamLimit = 100;
  this.scope.chart.efficiency = 0.1;
  this.scope.chart.refresh = false;
  this.scope.chart.error = '';
  this.scope.chart.ready;
  this.scope.calcRequests = this.calcRequests.bind(this);

};
appController.$inject = ['$scope'];

appController.prototype.calcRequests = function() {
    var chart = this.scope.chart;

    // if we tally manually we don't request
    var rootViewerReqs = (chart.gameLimit || chart.streamLimit) ? 1 : 0;

    // estimating ~1000 games
    var gameReqs = chart.gameLimit <= 0 ? 1000 :
      chart.gameLimit < 100 ? 1 : Math.ceil(chart.gameLimit / 100);

    // estimating each game to contain ~500 streams
    var streamReqs = chart.streamLimit <= 0 ? chart.gameLimit * 5 :
      chart.gameLimit;

    return rootViewerReqs + gameReqs + streamReqs;
};


module.exports = appController;
