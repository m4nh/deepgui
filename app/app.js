'use strict';

// Declare app level module which depends on views, and components
angular
    .module('myApp', [
      /*'graphview',*/ 'dataview', 'ngRoute', 'myApp.view1', 'myApp.view2',
      'rosproxy', 'myApp.version', 'schemaForm',
      // draw2d
      'draw2d.policies.TypedConnectionPolicy',
      // models
      'model.nodes.BaseNode', 'model.nodes.ai.Conv2D',
      // services
      'services.utils.ColorsService', 'services.mfactory.ModelsFactory'
    ])
    .config([
      '$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/view1'});


      }
    ]);