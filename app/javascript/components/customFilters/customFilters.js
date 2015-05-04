var angular = require('angular');

var percentFilter = require('./percent.filter');
var bgImageFilter = require('./bgImage.filter');

var customFilters = angular.module('CustomFilters', []);
customFilters.filter('percent', percentFilter);
customFilters.filter('bgImage', bgImageFilter);

module.exports = customFilters;
