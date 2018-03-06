'use strict';
angular

    .module('services.mfactory.ModelsFactory', [])

    .factory('ModelsFactory', [
      '$injector',
      function($injector) {

        var handle = this;

        /**
         * Models cache
         */
        handle.store = {};

        /**
         * Clears Models cache
         */
        handle.clearStore = function() { handle.store = {}; };

        /**
         * Generates an UUID
         */
        handle.generateID = function() {
          return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
              .replace(
                  /[018]/g, c => (c ^
                                  crypto.getRandomValues(new Uint8Array(1))[0] &
                                      15 >> c / 4)
                                     .toString(16))
        };

        /**
         *
         * @param {*} data
         */
        handle.transformModelData = function(data) {
          if (data && data.id) {
            var cached_data = handle.getStoredModel(data.id);
            if (cached_data === undefined) {
              if (data._type_) {
                return handle.generateModelType(data._type_, data, data.id);
              }
            } else {
              return cached_data;
            }
          }
          return data;
        };


        /**
         * Retrieves a stored model if any
         * @param {*} id
         */
        handle.getStoredModel = function(id) { return handle.store[id]; };

        /**
         * Generates a generic model from type and data
         * @param {*} type
         * @param {*} data
         */
        handle.generateModelType = function(type, data, force_id) {
          var t = $injector.get(type);
          var id = force_id !== undefined ? force_id : handle.generateID();
          var obj = new t(id, data);
          obj._type_ = type;
          handle.store[id] = obj;
          return obj;
        };

        return handle;
      }
    ]);