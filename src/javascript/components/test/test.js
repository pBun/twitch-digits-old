var angular = require('angular');

// var TestController = require('./test.controller');
var TestDirective = require('./test.directive');

var testModule = angular.module('TestModule', []);
// TestModule.controller('TestCtrl', TestController);
testModule.directive(TestDirective.DIRECTIVE_NAME, TestDirective);

console.log('test module loaded!');

module.exports = testModule;
