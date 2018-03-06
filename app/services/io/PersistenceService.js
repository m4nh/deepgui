'use strict';
angular

    .module('services.io.PersistenceService', [])

    .factory('PersistenceService', [
      '$injector', '$q', 'ModelsFactory',
      function($injector, $q, ModelsFactory) {

        var handle = this;

        handle._writer = new draw2d.io.json.Writer();
        handle._reader = new draw2d.io.json.Reader();

        handle.store = {};

        /**
         *
         * @param {*} canvas
         */
        handle.saveToJson = function(canvas) {
          var deferred = $q.defer();
          handle.saveCanvasToJson(canvas).then(function(v) {
            var data = {canvas: v};
            deferred.resolve(data);
          });
          return deferred.promise;
        };

        /**
         * Canvas marshal to Json
         * @param {*} canvas
         */
        handle.saveCanvasToJson = function(canvas) {
          var deferred = $q.defer();
          handle._writer.marshal(
              canvas, function(json) { deferred.resolve(json); });
          return deferred.promise;
        };



        /**
         * Canvas unmarshal from json
         * @param {*} canvas
         * @param {*} json
         */
        handle.loadCanvasFromJson = function(canvas, json) {
          var json_canvas = json.canvas !== undefined ? json.canvas : json;
          handle._reader.unmarshal(canvas, json_canvas);
          var figures = canvas.getFigures().data;
          $.each(figures, function(i, figure) {
            var new_data =
                ModelsFactory.transformModelData(figure.getUserData());
            figure.setUserData(new_data);
          });
        };

        /**
         * Save json to file
         * @param {*} json
         * @param {*} filename
         */
        handle.saveToFile = function(json, filename) {
          var json_str = JSON.stringify(json);
          var a = document.createElement("a");
          var file = new Blob([json_str], {type: "application/json"});
          a.href = URL.createObjectURL(file);
          a.download = filename;
          a.click();
        };

        handle.test = function() {};

        return handle;
      }
    ]);