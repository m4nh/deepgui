'use strict';
angular

    .module('model.nodes.BaseNode', [])

    .factory('BaseNode', [
      'ColorsService',
      function(ColorsService) {

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
                  showPaletteOnly: true,
                  showPalette: true,
                  palette: [ColorsService.getDefaultPalette()

                  ]
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

      }
    ]);