var angular = require('angular');
var TestController = require('./test.controller');
var TestTemplate = require('./test.html');

var testDirective = function($window) {
  return {
    restrict: 'EA',
    scope: {
      'test': '=' + testDirective.DIRECTIVE_NAME
    },
    controller: TestController,
    link: function(scope, element, attrs, ctrl) {

      element.on('click', ctrl.doSomething.bind(ctrl));

    },
    replace: true,
    template: TestTemplate
  };
};
testDirective.$inject = ['$window'];
testDirective.DIRECTIVE_NAME = 'test';

module.exports = testDirective;
