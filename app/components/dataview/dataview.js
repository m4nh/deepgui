'use strict';
angular.module('dataview', []).directive('dataview', [
  'ColorsService',
  function(ColorsService) {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'components/dataview/dataview.html',
      // CONTROLLER
      controller: function($scope, $element, Conv2D) {

        console.log(ColorsService.getColor("red", "900"));

        $scope.initModel = function(model) {
          $scope.model = model;
          if (model && model.getSchema) {
            $scope.model_schema = $scope.model.getSchema();
            $scope.layout_schema = $scope.model.getLayoutSchema()[0];
            $scope.layout_form = $scope.model.getLayoutSchema()[1];
          } else {
            $scope.model_schema = null;
            $scope.layout_schema = null;
          }
        };


        $scope.$watch("model", function(e, v) {
          $scope.$emit("modelEvents.genericUpdate");
        }, true);

        $scope.$on("canvasEvents.shapeSelected", function(event, target) {
          var figure = target.figure;
          if (target.figure) {
            $scope.initModel(target.figure.getUserData());
          } else {
            $scope.initModel(null);
          }
          $scope.$apply();
          console.log("EVENT", event, target);
        });
      }
    };
  }
]);