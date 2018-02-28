var LayerShape = draw2d.SetFigure.extend({

  NAME: "LayerShape",

  init: function(model, attr, setter, getter) {
    this._super(
        $.extend({stroke: 0, bgColor: null, width: 150, height: 150}, attr),
        setter, getter);
    var port;

    // UserData
    if (model) {
      this.setModel(model);
      // model.setGraphObject(this);

      var handle = this;


      // Title
      var title = new draw2d.shape.basic.Label({
        text: this._model.getGraphConfiguration().title,
        stroke: 0,
        fontColor: "#0d0d0d",
        userData: {"name": "@title"}
      });
      this.add(title, this.getTitleLocator());

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


    // var p1 = new GeneralConnector(this, ConnectorType.INPUT, null);

    // var p_out_1 = new GeneralConnector(
    //     this, ConnectorType.OUTPUT, null, "number", max_connections =
    //     10);

    // var handle = this;
    // setTimeout(function() {
    //   p_out_1.destroy();
    //   new GeneralConnector(
    //       handle, ConnectorType.OUTPUT, null, "number",
    //       max_connections =
    //       10);

    // }, 3000);
    // // LABEL
    // var label = null;



    this.persistPorts = true;
  },

  setModel: function(model) {
    this._model = model;
    this.setUserData(model);
  },

  update: function() {

    var handle = this;
    $.each(this.getChildren().data, function(i, figure) {
      console.log("HOOK", figure);
      if (figure && figure.getUserData()) {
        if (figure.getUserData().name &&
            figure.getUserData().name.indexOf('@') != -1) {
          var name = figure.getUserData().name.replace("@", "");

          if (name == "title") {
            figure.text = handle._model.getGraphConfiguration().title;
            handle.remove(figure);
            handle.add(figure, handle.getTitleLocator());
          }
          console.log("CHILDREND", figure, name);
        }
      }

    });
    // this.title.text = this._model.getGraphConfiguration().title;
    // this.title.repaint();
    // this.remove(this.title);
    // this.add(this.title, this.getTitleLocator());
    this.repaint();
  },

  getTitleLocator: function() {
    return new draw2d.layout.locator.FloatingLocator(50, 10);
  },

  createSet: function() {
    this.canvas.paper.setStart();

    // Rectangle
    this._shape = this.canvas.paper.path('M0 0L150 0L150 150L0 150Z');
    this._shape.attr({
      "stroke": "#D6D13E",
      "stroke-width": 1,
      "fill": "#CDFF45",
      "dasharray": null,
      "opacity": 1
    });
    this._shape.data("name", "Rectangle");

    return this.canvas.paper.setFinish();
  },

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