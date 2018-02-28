DEBUG_HANDLE = null;
'use strict';


angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])


.controller('View1Ctrl', ['$scope', '$location', 'RosProxy', function($scope, $location, RosProxy) {


    $scope.selectSFM = function(sfm) {
        RosProxy.setSelectedSFM(sfm);
        $location.path("view2");
    }

    $scope.updateList = function() {
        RosProxy.listOfStateMachines().then(function(list) {
            $scope.sfm_list = list;
        })
    }

    $scope.updateList();

}]);