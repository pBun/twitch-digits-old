var angular = require('angular');

var percentFilter = require('./percent.filter');

var customFilters = angular.module('CustomFilters', []);
customFilters.filter('percent', percentFilter);

module.exports = customFilters;
