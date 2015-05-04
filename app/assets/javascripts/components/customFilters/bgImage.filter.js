var filter = function() {
    return function (input) {
        return input ? 'background-image: url(' + input + ');' : '';
    }
};
filter.$inject = [];

module.exports = filter;
