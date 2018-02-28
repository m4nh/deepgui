'use strict';
angular

    .module('model.nodes.ai.Conv2D', [])

    .factory('Conv2D', [
      'ModelsFactory',
      function(ModelsFactory) {



        class Conv2D {
          constructor(id, data) {
            this.id = id;
            data = data || {}
            this.name = data.name || "Unnamed";
            this.padding = data.padding || "same";
            this.kernel_size = data.kernel_size || "1x1";
            this.stride = data.stride || 1;
          }

          /*
           *
           */
          getSchema() {
            return {
              type: "object",

                  properties: {
                    name: {type: "string", title: "Name"},
                    padding: {type: "string", enum: ['same']},
                    kernel_size:
                        {type: "string", enum: ['1x1', '3x3', '5x5', '7x7']},
                    stride: {type: "number"}
                  }
            }
          }

          /*
           *
           */
          getGraphConfiguration() {
            return {
              title: this.toString(), title_long: this.toStringLong(), ports: [
                {name: "input", type: "input", max: "1", datatype: "TENSOR"}, {
                  name: "output",
                  type: "output",
                  max: "100",
                  datatype: "TENSOR"
                }
              ]
            }
          }

          /*
           *
           */
          setGraphObject(obj) {
            this._graph_object = obj;
            console.log("PERSISTENT", obj.getPersistentAttributes());
          }
          getGraphObject() { return this._graph_object; }

          /*
           *
           */
          toString() { return 'Conv2D (' + this.name + ')'; }
          toStringLong() {
            return 'Conv2D(' + this.kernel_size + '@' + this.stride + ')';
          }
        }


        return Conv2D;

      }
    ]);