var filter = function($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals || 0) + '%';
    }
};
filter.$inject = ['$filter'];

module.exports = filter;
