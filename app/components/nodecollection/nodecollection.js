'use strict';

angular
    .module('nodecollection', ['ngDragDrop'])

    .directive('nodecollection', [
      'ColorsService',
      function(ColorsService) {
        return {
          restrict: 'E',
          transclude: true,
          templateUrl: 'components/nodecollection/nodecollection.html',
          // CONTROLLER

          controller: function($scope, $element) {

            console.log("NODE COLLECION CREATED");
          }
        };
      }
    ]);
