'use strict';
angular.module('dataview', [])
    .directive('dataview', [function() {
                 return {
                   restrict: 'E',
                   transclude: true,
                   templateUrl: 'components/dataview/dataview.html',
                   // CONTROLLER
                   controller: function($scope, $element, Conv2D) {

                     $scope.initModel = function(model) {
                       $scope.model = model;
                       $scope.model_schema = $scope.model.getSchema();
                       $scope.model_form = ["*"];
                     };

                     $scope.initModel(new Conv2D("node"));

                     $scope.$watch("model", function(after, before) {}, true);
                   }
                 };
               }]);