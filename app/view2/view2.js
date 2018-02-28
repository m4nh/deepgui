'use strict';

angular
    .module('myApp.view2', ['ngRoute'])

    .config([
      '$routeProvider',
      function($routeProvider) {
        $routeProvider.when(
            '/view2',
            {templateUrl: 'view2/view2.html', controller: 'View2Ctrl'});
      }
    ])

    .controller('View2Ctrl', [
      "$scope", "$rootScope", "$interval", "$q", 'RosProxy', 'Conv2D',
      'TypedConnectionPolicy', 'ModelsFactory',
      function(
          $scope, $rootScope, $interval, $q, RosProxy, Conv2D,
          TypedConnectionPolicy, ModelsFactory) {

        console.log("VIEW2 CREATED!", ModelsFactory.generateID());



        $scope.current_sfm = RosProxy.getSelectedSFM();

        var onSelectionChanged = function(event, target) {
          if (target.figure)
            console.log("SELECTD", target.figure.getChildren());
          $rootScope.$broadcast(
              "canvasEvents.shapeSelected", {figure: target.figure});

        };



        var canvas = new draw2d.Canvas("gfx_holder");

        // Seelction
        canvas.on("select", $.proxy(onSelectionChanged, this));

        // Connection Policy
        canvas.installEditPolicy(new StrongConnectionPolicy());

        // Grid Controls
        canvas.setScrollArea("#gfx_holder");
        canvas.installEditPolicy(new draw2d.policy.canvas.ShowGridEditPolicy());
        canvas.installEditPolicy(
            new draw2d.policy.canvas.SnapToGeometryEditPolicy());
        canvas.installEditPolicy(
            new draw2d.policy.canvas.SnapToInBetweenEditPolicy());
        canvas.installEditPolicy(
            new draw2d.policy.canvas.SnapToCenterEditPolicy());


        var d2 = new TestShape({width: 150, height: 160, x: 100, y: 300});
        canvas.add(d2);

        d2 = new TestShape({width: 150, height: 160, x: 100, y: 300});
        canvas.add(d2);


        canvas.add(new LayerShape(ModelsFactory.generateModelType('Conv2D', {
          "name": "layer_x1"
        })));
        canvas.add(new LayerShape(ModelsFactory.generateModelType('Conv2D', {
          "name": "layer_x2"
        })));
        canvas.add(new LayerShape(ModelsFactory.generateModelType('Conv2D', {
          "name": "layer_x2"
        })));
        canvas.add(new LayerShape(ModelsFactory.generateModelType('Conv2D', {
          "name": "layer_x2"
        })));

        $scope.saveAndLoad = function() {
          var writer = new draw2d.io.json.Writer();
          writer.marshal(canvas, function(json) {
            // convert the json object into string representation
            var jsonTxt = JSON.stringify(json, null, 2);
            // console.log(json);
            setTimeout(function() {
              canvas.clear();
              setTimeout(function() {
                // (load)
                var reader = new draw2d.io.json.Reader();
                reader.unmarshal(canvas, json);
                var figures = canvas.getFigures().data;
                console.log("RELAODED", canvas);
                $.each(figures, function(i, figure) {
                  console.log("RELOADING", figure);
                  var userData = figure.getUserData();
                  if (userData && userData.id) {
                    var stored = ModelsFactory.getStoredModel(userData.id);
                    if (stored) {
                      console.log("THERE IS A COPY!");
                      if (figure.setModel) figure.setModel(stored);
                    }
                  }
                });

                // writer.marshal(canvas, function(json) { console.log(json);
                // });
              }, 2000);
            }, 2000);
            // insert the json string into a DIV for preview or post
            // it via ajax to the server....

          });
        };


        setTimeout(function() {
          $scope.$broadcast('GRAPH_CREATE', {
            id: 2,
            data: {
              states: [{name: "a"}, {name: "b"}, , {name: "c"}, {name: "b"}]
            }
          });
          console.log("CIAO");
        }, 2000);

        /**Messages */
        $scope.$on("$destroy", function(event) {
          $interval.cancel($scope.updateTimer);
        });


        $scope.$on("modelEvents.genericUpdate", function(event, data) {
          console.log("MODEL EVENT", event, data);
          var figures = canvas.getFigures().data;
          $.each(figures, function(i, v) {
            if (v.update) v.update();
          });
        });

      }
    ]);