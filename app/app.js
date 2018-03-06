'use strict';

// Declare app level module which depends on views, and components
angular
    .module(
        'myApp',
        [
          /*'graphview',*/

          'ngRoute', 'myApp.view1', 'myApp.view2', 'rosproxy', 'myApp.version',
          'schemaForm', 'ngDragDrop',
          // Directives
          'dataview', 'nodecollection',

          // draw2d
          'draw2d.policies.TypedConnectionPolicy',
          // models
          'model.nodes.BaseNode', 'model.nodes.ai.Conv2DNode',
          'model.nodes.ai.ConcatenateNode',
          // services
          'services.utils.ColorsService', 'services.mfactory.ModelsFactory',
          'services.io.PersistenceService'
        ])
    .config([
      '$locationProvider', '$routeProvider',
      function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/view1'});


      }
    ]);