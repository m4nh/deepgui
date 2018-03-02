'use strict';
angular

    .module('model.nodes.ai.ConcatenateNode', [])

    .factory('ConcatenateNode', [
      'BaseNode', 'ColorsService',
      function(BaseNode, ColorsService) {

        class ConcatenateNode extends BaseNode {
          constructor(id, data) {
            super(id, {bgcolor: ColorsService.getColor("green")});
            data = data || {}
            this.name = data.name || "Unnamed";
          }

          /*
           *
           */
          getSchema() {
            var schema = {
              type: "object",

              properties: {
                name: {type: "string", title: "Name"}

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
                {name: "input", type: "input", max: "100", datatype: "TENSOR"},
                {
                  name: "output",
                  type: "output",
                  max: "100",
                  datatype: "TENSOR"
                }
              ]
            }
          }

          getName() { return this.name; }

          toStringType() { return 'Concatenate'; }
          /*
           *
           */
          toString() { return 'Concatenate (' + this.name + ')'; }
          toStringLong() {
            var s = "";
            s += "Concatenate";
            return s;
          }
        }


        return ConcatenateNode;

      }
    ]);