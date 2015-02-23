var angular = require('angular');

var testController = function($scope) {

  this.scope = $scope;

  this.init();

};
testController.$inject = ['$scope'];

testController.prototype.init = function() {
  this.scope.description = 'Starter Gulp + Browserify project equipped to handle the following:';
  this.scope.tools = [
    'Browserify-shim',
    'Browserify / Watchify',
    'BrowserSync',
    'CoffeeScript',
    'Compass',
    'SASS',
    'Handlebars',
    'Image optimization',
    'LiveReload',
    'Non common-js jquery plugin',
    'Npm backbone',
    'Npm jquery',
    'Underscore (included with Backbone)'
  ];
};

testController.prototype.doSomething = function() {
  console.log('test controller did something!')
};

module.exports = testController;
