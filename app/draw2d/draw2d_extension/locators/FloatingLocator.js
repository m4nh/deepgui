
draw2d.layout.locator.FloatingLocator =
    draw2d.layout.locator.PortLocator.extend({
      NAME: "draw2d.layout.locator.FloatingLocator",

      /**
       * @constructor
       *
       *
       * @param {
        Number} x the x coordinate in percent of the port
       * relative to the left of the parent
       * @param {
        Number} y the y coordinate in percent of the port
       * relative to the top of the parent
       */
      init: function(x, y) {
        this._super();

        this.x = x;
        this.y = y;
      },

      /**
       * @method
       * Controls the location of an I{
        @link draw2d.Figure}
       *
       * @param {
        Number} index child index of the figure
       * @param {
        draw2d.Figure} figure the figure to control
       *
       * @template
       **/
      relocate: function(index, target) {

        var node = target.getParent();
        var w = target.getWidth();
        var h = target.getHeight();
        var x = node.getWidth() / 100 * this.x - w * 0.5;
        var y = node.getHeight() / 100 * this.y - h * 0.5;

        if (isNaN(x)) {
          x = y = 0.0;
        }
        this.applyConsiderRotation(target, x, y);
      },

      getPersistentAttributes: function() {
        var memento = {};
        memento.x = this.x;
        memento.y = this.y;
        memento.type = this.NAME;
        return memento;

      },

      setPersistentAttributes: function(memento) {

        this.x = memento.x;
        this.y = memento.y;
      }


    });