/*
 * UTILS
 */
draw2d.utils = {
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } :
                    null;
  }
};


var LayerShape = draw2d.shape.basic.Rectangle.extend({

  NAME: "LayerShape",

  init: function(model, attr, setter, getter) {
    this._super(
        $.extend({stroke: 0, bgColor: null, width: 150, height: 150}, attr),
        setter, getter);
    var port;



    // UserData
    if (model) {
      this.setModel(model);

      // Layout
      this.setLayoutByModel(model);

      // Handle
      var handle = this;

      // Title
      // Creates N childs with this technique: important part is to user
      // "userData" as hook to
      // get the related child during update procedure in "update()"
      // function
      var title = this.createInnerLabel(
          "title", "TITLE", 50, 50, "getUserData().toStringLong()");

      this.createInnerLabel(
          "name", "TITLE", 50, -10, "getUserData().getName()");
      // Ports

      $.each(model.getGraphConfiguration().ports, function(i, port_data) {
        port_type = port_data.type == 'input' ? ConnectorType.INPUT :
                                                ConnectorType.OUTPUT;
        var port = new GeneralConnector(
            handle, port_type, port_data.name, port_data.datatype,
            port_data.max);

      });
    } else {
      console.log("LOADING FROM DATABSE", this);
    }

    // Persistence
    this.persistPorts = true;
  },

  createInnerLabel: function(name, text, x, y, cb) {
    cb = cb !== undefined ? cb : 'fakeLabelContent()';
    var title = new draw2d.shape.basic.Label({
      text: text || "",
      stroke: 0,
      fontColor: "#000000",
      fontFamily: "Verdana",
      userData: {"label": "@" + name + "@" + x + "," + y + "@" + cb},
      cssClass: "centered-label"
    });
    this.add(title, new draw2d.layout.locator.FloatingLocator(x, y));
    return title;
  },

  getInnerLabel: function(figure) {
    if (figure && figure.getUserData() && figure.getUserData().label) {
      var chunks = figure.getUserData().label.split("@");
      var coords = chunks[2].split(",");
      return {
        name: chunks[1], x: parseInt(coords[0]), y: parseInt(coords[1]),
            cb: chunks[3]
      }
    }
    return null;
  },

  fakeLabelContent: function() { return "FLable"; },

  setModel: function(model) {
    this._model = model;
    this.setUserData(model);
  },

  getChildrenByName: function(name) {
    var found = null;
    var handle = this;
    $.each(this.getChildren().data, function(i, figure) {
      var label = handle.getInnerLabel(figure);
      if (label && label.name.indexOf(name) != -1) {
        found = figure;
        return;
      }
    });
    return found;
  },

  setLayoutByModel: function(model) {

    var title = this.getChildrenByName('title');
    if (title) {
      var lightness = jQuery.Color(model.bgcolor).lightness();
      if (lightness > 0.5) {
        title.setFontColor("#333333");
      } else {
        title.setFontColor("#eeeeee");
      }
    }

    this.setBackgroundColor(model.bgcolor);

    var handle = this;
    $.each(this.getPorts().data, function(i, port) {
      port.setBackgroundColor(model.bgcolor)
    });

  },



  update: function() {

    this.setLayoutByModel(this.getUserData());

    var handle = this;
    $.each(this.getChildren().data, function(i, figure) {
      var label = handle.getInnerLabel(figure);
      if (label) {
        var text = eval("handle." + label.cb);
        figure.text = text;
        handle.remove(figure);
        handle.add(
            figure,
            new draw2d.layout.locator.FloatingLocator(label.x, label.y));
      }
    });
    // this.title.text = this._model.getGraphConfiguration().title;
    // this.title.repaint();
    // this.remove(this.title);
    // this.add(this.title, this.getTitleLocator());
    this.repaint();
  },

  getTitleLocator: function() {
    return new draw2d.layout.locator.FloatingLocator(50, 50);
  },

  // createSet: function() {
  //   this.canvas.paper.setStart();

  //   // Rectangle
  //   this._shape = this.canvas.paper.path('M0 0L150 0L150 150L0 150Z');
  //   this._shape.attr({
  //     "stroke": "#D6D13E",
  //     "stroke-width": 1,
  //     "fill": "#CDFF45",
  //     "dasharray": null,
  //     "opacity": 1
  //   });
  //   this._shape.data("name", "Rectangle");

  //   return this.canvas.paper.setFinish();
  // },

  applyAlpha: function() {},

  calculate: function() {},

  onStart: function() {},

  onStop: function() {},

  getParameterSettings: function() { return []; },

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
      // console.log("RESTORING", json);
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

// /**
//  * by 'Draw2D Shape Designer'
//  *
//  * Custom JS code to tweak the standard behaviour of the generated
//  * shape. add your custome code and event handler here.
//  *
//  *
//  */
// TestShape = TestShape.extend({

//   init: function(attr, setter, getter) {
//     this._super(attr, setter, getter);

//     // your special code here
//   },

//   /**
//    *  Called by the simulator for every calculation
//    *  loop
//    *  @required
//    **/
//   calculate: function() {},


//   /**
//    *  Called if the simulation mode is starting
//    *  @required
//    **/
//   onStart: function() {},

//   /**
//    *  Called if the simulation mode is stopping
//    *  @required
//    **/
//   onStop: function() {}
// });