'use strict';
angular

    .module('model.nodes.ai.Conv2D', [])

    .factory('Conv2D', [
      'BaseNode', 'ColorsService',
      function(BaseNode, ColorsService) {

        class Conv2D extends BaseNode {
          constructor(id, data) {
            super(id, {bgcolor: ColorsService.getColor("blue")});
            data = data || {}
            this.name = data.name || "Unnamed";
            this.padding = data.padding || "same";
            this.size = 128;
            this.kernel_size = data.kernel_size || "1x1";
            this.stride = data.stride || 1;
          }

          /*
           *
           */
          getSchema() {
            var schema = {
              type: "object",

              properties: {
                name: {type: "string", title: "Name"},
                size: {type: "number"},
                kernel_size:
                    {type: "string", enum: ['1x1', '3x3', '5x5', '7x7']},
                padding: {type: "string", enum: ['same']},
                stride: {type: "number"}

              }
            };
            return schema;
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

          getName() { return this.name; }
          /*
           *
           */
          toString() { return 'Conv2D (' + this.name + ')'; }
          toStringLong() {
            var s = "";
            s += "Conv2D\n";
            s += this.size + " x [" + this.kernel_size + "]\n";
            s += "Stride(" + this.stride + "," + this.stride + ")";
            return s;
          }
        }


        return Conv2D;

      }
    ]);