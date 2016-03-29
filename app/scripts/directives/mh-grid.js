"use strict";
angular.module('ngGridApp')
  .directive('mhGridDirective', function() {
    return {
      restrict: 'E',
      scope: {
        customerInfo: '=info'
      },
      templateUrl: 'scripts/directives/templates/mhGridTmpl.html',
      link: function() {},
      controller: function() {}
    };
  });
