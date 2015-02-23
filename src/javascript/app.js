var angular = require('angular');
var ngRoute = require('angular-route');
var ngAnimate = require('angular-animate');
var ngAria = require('angular-aria');
var ngMaterial = require('angular-material/bower-material');
var TestModule = require('./components/test/test');

var app = angular.module('testApp', ['ngRoute', 'ngAria', 'ngAnimate', 'ngMaterial', TestModule.name]);

// routes
app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/templates/splash.html',
    }).
    otherwise({
      redirectTo: '/'
    });
}]);

angular.bootstrap(document.body, [app.name]);

console.log('app.js loaded!');
