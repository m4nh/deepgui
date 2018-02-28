
// Databinding: The backbone view with callback method to sync the Draw2D model
// with the
//              backbone world.
//
var OpAmpBackboneView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change:x', $.proxy(this.renderX, this));
    this.model.on('change:y', $.proxy(this.renderY, this));
    this.items = [
      {'key': "A", 'value': 1}, {'key': "B", 'value': 2},
      {'key': "C", 'value': 3}, {'key': "D", 'value': 4}
    ];
  },
  events: {
    'keyup #property_position_x': 'updateX',
    'keyup #property_position_y': 'updateY',
    'keyup #property_name': 'updateName',
    'change #item-selector': 'itemChanged'
  },
  close: function() {
    this.model.off(this.renderX);
    this.model.off(this.renderY);
  },
  itemChanged: function(v) {
    this.model.getUserData().item = v.target.value;
    console.log("ITEM CHANGED", v.target.value);
  },
  renderX: function() {
    this.$('#property_position_x').val(this.model.attr('x'));
  },
  updateX: function(newX) {
    this.model.attr("x", parseFloat(this.$('#property_position_x').val()));
  },

  renderY: function() {
    this.$('#property_position_y').val(this.model.attr('y'));
  },
  updateY: function(newX) {
    this.model.attr("y", parseFloat(this.$('#property_position_y').val()));
  },

  updateName: function(newX) {
    this.model.getUserData().name = this.$('#property_name').val();
  },

  render: function() {
    var html = _.template(
        '<div id="property_position_container" class="panel panel-default">' +
            ' <div class="panel-heading " >' +
            '     Position' +
            '</div>' +
            ' <div class="panel-body" id="position_panel">' +
            '   <div class="form-group">' +
            '       x <input id="property_position_x" type="text" class="form-control" value="<%= figure.attr("x") %>"/><br>' +
            '       y <input id="property_position_y" type="text" class="form-control" value="<%= figure.attr("y") %>"/>' +
            '   </div>' +
            ' </div>' +
            '</div>' +

            '<div id="property_position_container" class="panel panel-default">' +
            ' <div class="panel-heading " >' +
            '     User Property' +
            '</div>' +
            ' <div class="panel-body" id="userdata_panel">' +
            '   <div class="form-group">' +
            '       <div class="input-group" ></div> ' +
            '       Type <input id="property_name" type="text" class="form-control" value="<%= figure.getUserData().name %>"/>' +
            '   </div>' +
            ' </div>' +
            ' <select id="item-selector"> ' +
            '   <% _.each(items,function(item){  %>' +
            '     <option <% if(item.key==figure.getUserData().item) { %> selected <% } %> value="<%= item.key %>"><%= item.value %></option>' +
            '   <% }); %>' +
            ' </select>' +
            '</div>',
        {figure: this.model, items: this.items});
    this.$el.html(html);
    return this;
  }
});

draw2d.layout.locator.GaiusLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "draw2d.layout.locator.GaiusLocator",

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

const ConnectorType = {
  INPUT: 0,
  OUTPUT: 1,
  HYBRID: 2,
};



class Connector {
  constructor(
      node, type, name = null, datatype = 'number', max_connections = 1,
      locator = null) {
    // Attributes
    this._port = null;
    this._locator = null;
    this._datatype = datatype;
    this._max_connections = max_connections;
    this._name = name;

    // Port Direction
    if (type == ConnectorType.INPUT) {
      this._port = draw2d.Configuration.factory.createInputPort(node);
      this._max_connections = 1;
      if (this._name == null) {
        this._name = "Port_" + type + "_" + node.inputPorts.getSize();
      }
    } else if (type == ConnectorType.OUTPUT) {
      this._port = draw2d.Configuration.factory.createOutputPort(node);
      if (this._name == null) {
        this._name = "Port_" + type + "_" + node.outputPorts.getSize();
      }
    }

    // Max connections
    this._port.setMaxFanOut(this._max_connections);
    this._port.setName(this._name);

    // Port Locator
    if (this._locator === null) {
      if (type == ConnectorType.INPUT) {
        this._locator = new draw2d.layout.locator.InputPortLocator()
      } else if (type == ConnectorType.OUTPUT) {
        this._locator = new draw2d.layout.locator.OutputPortLocator()
      }
    }

    // Creates port
    node.addPort(this._port, locator);
    this._port.setUserData({'type': this._type, 'datatype': this._datatype});
    // node.addPort(this, locator);
    // node.setDimension(node.width, node.height);
    // console.log("PORT CREATED", type, locator);
  }

  get datatype() { return this._datatype; }

  createCommand(request) {
    if (request.getPolicy() === draw2d.command.CommandType.CONNECT) {
      // source and target are changed.
      if (this.type == 'input') {
        return new draw2d.command.CommandConnect(
            request.source, request.target, request.source, request.router);
      } else if (this.type == 'output') {
        return new draw2d.command.CommandConnect(
            request.target, request.source, request.source, request.router);
      }
    }

    // ...else call the base class
    return this._super(request);
  }

  test() { console.log("TEST!"); }
};


var testShape = draw2d.SetFigure.extend({

  NAME: "testShape",

  init: function(attr, setter, getter) {
    this._super(
        $.extend({stroke: 0, bgColor: null, width: 150, height: 150}, attr),
        setter, getter);
    var port;
    // Port

    port = new Connector(this, ConnectorType.INPUT, null);
    port = new Connector(this, ConnectorType.INPUT, null);
    port = new Connector(this, ConnectorType.INPUT, null);

    new Connector(
        this, ConnectorType.OUTPUT, null, "number", max_connections = 10);
    new Connector(
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
          new draw2d.layout.locator.GaiusLocator(25, step * i + step * 0.5));
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
    console.log("STORING", memento);
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
      console.log("RESTORING", json);
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
testShape = testShape.extend({

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