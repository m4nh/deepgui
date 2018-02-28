'use strict';
angular

    .module('model.nodes.BaseNode', [])

    .factory(
        'BaseNode', [function() {

          class BaseNode {
            constructor(id, data) {
              this.id = id;
              data = data || {}
              this.bgcolor = data.bgcolor || "#ffaa33";
              this.bordercolor = data.bordercolor || "#000000";
            }

            /*
             *
             */
            getSchema() { return {}; }

            getLayoutSchema() {
              return [
                {
                  type: "object",
                  properties: {bgcolor: {"type": "string", "format": "color"}}
                },
                [{
                  key: "bgcolor",
                  colorFormat: 'hex',
                  spectrumOptions: {
                    preferredFormat: 'hex',
                    showAlpha: false,
                    palette: [['black', 'white'], ['red', 'green']]
                  }
                }]
              ]
            }

            /*
             *
             */
            getGraphConfiguration() { return {}; }

            /*
             *
             */
            toString() { return 'BaseNode'; }
            toStringLong() { return 'BaseNode'; }
          }


          return BaseNode;

        }]);