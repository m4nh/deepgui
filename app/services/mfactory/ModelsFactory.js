'use strict';
angular

    .module('services.mfactory.ModelsFactory', [])

    .factory('ModelsFactory', [
      '$injector',
      function($injector) {

        var handle = this;

        handle.store = {};

        this.generateID = function() {
          return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
              .replace(
                  /[018]/g, c => (c ^
                                  crypto.getRandomValues(new Uint8Array(1))[0] &
                                      15 >> c / 4)
                                     .toString(16))
        };

        this.getStoredModel = function(id) { return handle.store[id]; };

        this.generateModelType = function(type, data) {
          var t = $injector.get(type);
          var id = handle.generateID();
          var obj = new t(id, data);
          obj._type_ = type;
          handle.store[id] = obj;
          return obj;
        };

        return handle;
      }
    ]);