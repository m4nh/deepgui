
class GeneralConnector {
  constructor(
      node, type, name = null, datatype = 'number', max_connections = 1,
      locator = null) {
    //
    // Attributes
    this._node = node;
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

  destroy() { this._node.removePort(this._port); }
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