var TestShape = draw2d.SetFigure.extend({

  NAME: "TestShape",

  init: function(attr, setter, getter) {
    this._super(
        $.extend({stroke: 0, bgColor: null, width: 150, height: 150}, attr),
        setter, getter);
    var port;
    // Port

    port = new GeneralConnector(this, ConnectorType.INPUT, null);

    port = new GeneralConnector(this, ConnectorType.INPUT, null);
    port = new GeneralConnector(this, ConnectorType.INPUT, null);

    new GeneralConnector(
        this, ConnectorType.OUTPUT, null, "number", max_connections = 10);
    new GeneralConnector(
        this, ConnectorType.OUTPUT, null, "number", max_connections = 10);


    // // LABEL
    // var label = null;

    let n = 3;
    let step = 100 / n;
    for (let i = 0; i < n; i++) {
      label = new draw2d.shape.basic.Label(
          {text: "I'm a Label", stroke: 0, fontColor: "#0d0d0d"});
      label.installEditor(new draw2d.ui.LabelInplaceEditor());
      this.add(
          label,
          new draw2d.layout.locator.FloatingLocator(25, step * i + step * 0.5));
      // new draw2d.layout.locator.XYRelPortLocator(50, step * i + step * 0.5));
      // new draw2d.layout.locator.CenterLocator(this));
    }


    // port = this.createPort(
    //     "output",
    //     new draw2d.layout.locator.XYRelPortLocator(100.66666666666666, 50));
    // port.setConnectionDirection(1);
    // port.setBackgroundColor("#37B1DE");
    // port.setName("Port");
    // port.setMaxFanOut(20);
    // port.setUserData({data_type: 'number'});
    // // Port
    // port = this.createPort(
    //     "input", new draw2d.layout.locator.XYRelPortLocator(
    //                  1.3333333333333333, 50.666666666666664));
    // port.setConnectionDirection(3);
    // port.setBackgroundColor("#37B1DE");
    // port.setName("Port");
    // port.setMaxFanOut(20);
    // port.setUserData({data_type: 'number'});
    this.persistPorts = true;


  },

  createShapeElement: function() {
    var shape = this._super();
    this.originalWidth = 150;
    this.originalHeight = 150;
    return shape;
  },

  createSet: function() {
    this.canvas.paper.setStart();

    // BoundingBox
    shape = this.canvas.paper.path("M0,0 L150,0 L150,150 L0,150");
    shape.attr({"stroke": "none", "stroke-width": 0, "fill": "none"});
    shape.data("name", "BoundingBox");

    // Label
    shape = this.canvas.paper.text(0, 0, '');
    shape.attr({
      "x": 43.1640625,
      "y": 97,
      "text-anchor": "start",
      "text": "",
      "font-family": "\"Arial\"",
      "font-size": 16,
      "stroke": "none",
      "fill": "#080808",
      "stroke-scale": true,
      "font-weight": "normal",
      "stroke-width": 0,
      "opacity": 1
    });
    shape.data("name", "Label");

    // Rectangle
    shape = this.canvas.paper.path('M0 0L150 0L150 150L0 150Z');
    shape.attr({
      "stroke": "#D6D13E",
      "stroke-width": 1,
      "fill": "#CDFF45",
      "dasharray": null,
      "opacity": 1
    });
    shape.data("name", "Rectangle");


    return this.canvas.paper.setFinish();
  },

  applyAlpha: function() {},

  layerGet: function(name, attributes) {
    if (this.svgNodes === null) return null;

    var result = null;
    this.svgNodes.some(function(shape) {
      if (shape.data("name") === name) {
        result = shape;
      }
      return result !== null;
    });

    return result;
  },

  layerAttr: function(name, attributes) {
    if (this.svgNodes === null) return;

    this.svgNodes.forEach(function(shape) {
      if (shape.data("name") === name) {
        shape.attr(attributes);
      }
    });
  },

  layerShow: function(name, flag, duration) {
    if (this.svgNodes === null) return;

    if (duration) {
      this.svgNodes.forEach(function(node) {
        if (node.data("name") === name) {
          if (flag) {
            node.attr({opacity: 0}).show().animate({opacity: 1}, duration);
          } else {
            node.animate({opacity: 0}, duration, function() { this.hide() });
          }
        }
      });
    } else {
      this.svgNodes.forEach(function(node) {
        if (node.data("name") === name) {
          if (flag) {
            node.show();
          } else {
            node.hide();
          }
        }
      });
    }
  },

  calculate: function() {},

  onStart: function() {},

  onStop: function() {},

  getParameterSettings: function() { return []; },

  /**
   * @method
   */
  addPort: function(port, locator) {
    this._super(port, locator);
    return port;
  },

  /**
   * @method
   * Return an objects with all important attributes for XML or JSON
   * serialization
   *
   * @returns {Object}
   */
  getPersistentAttributes: function() {
    var memento = this._super();

    // add all decorations to the memento
    //
    memento.labels = [];
    // this.children.each(function(i, e) {
    //   var labelJSON = e.figure.getPersistentAttributes();
    //   labelJSON.locator = e.locator.NAME;
    //   memento.labels.push(labelJSON);
    // });
    this.children.each(function(i, e) {
      memento.labels.push({
        figure: e.figure.getPersistentAttributes(),
        locator: e.locator.getPersistentAttributes()
      });
    });
    return memento;
  },

  // /**
  //  * @method
  //  * Read all attributes from the serialized properties and transfer them
  //  into
  //  * the shape.
  //  *
  //  * @param {Object} memento
  //  * @returns
  //  */
  setPersistentAttributes: function(memento) {
    this._super(memento);

    // remove all decorations created in the constructor of this element
    //
    this.resetChildren();

    // and add all children of the JSON document.
    //
    $.each(memento.labels, $.proxy(function(i, json) {
      // create the figure stored in the JSON
      var figure = eval("new " + json.figure.type + "()");
      figure.setPersistentAttributes(json.figure);

      // // instantiate the locator
      var locator = eval("new " + json.locator.type + "()");
      locator.setPersistentAttributes(json.locator);

      // // add the new figure as child to this figure
      this.add(figure, locator);
    }, this));
  }
});

/**
 * by 'Draw2D Shape Designer'
 *
 * Custom JS code to tweak the standard behaviour of the generated
 * shape. add your custome code and event handler here.
 *
 *
 */
TestShape = TestShape.extend({

  init: function(attr, setter, getter) {
    this._super(attr, setter, getter);

    // your special code here
  },

  /**
   *  Called by the simulator for every calculation
   *  loop
   *  @required
   **/
  calculate: function() {},


  /**
   *  Called if the simulation mode is starting
   *  @required
   **/
  onStart: function() {},

  /**
   *  Called if the simulation mode is stopping
   *  @required
   **/
  onStop: function() {}
});