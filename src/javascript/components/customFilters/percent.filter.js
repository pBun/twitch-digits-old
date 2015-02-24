var angular = require('angular');

var filter = function($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    }
};
filter.$inject = ['$filter'];

module.exports = filter;
