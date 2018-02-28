angular.module('rosproxy', ['rosproxy'])

.factory('RosProxy', ['$q', function($q) {
    var self = this;

    self.serviceTest = function() {
        console.log("Service test");
    }

    /**
     * Attributes
     */
    self.serverProxy = null;
    self.ros = null;
    self.selected_sfm = "";


    self.setSelectedSFM = function(name) {
        self.selected_sfm = name;
    };

    self.getSelectedSFM = function() {
        return self.selected_sfm;
    };

    /**
     * Creates Ros Bridge
     */
    self.createRosBridge = function() {
        if (self.ros != null) return self.ros;

        var deferred = $q.defer();

        self.ros = new ROSLIB.Ros({
            url: 'ws://10.211.55.10:9090'
        });

        self.ros.on('connection', function() {
            console.log('Connected to websocket server.');
            deferred.resolve(true);
        });

        self.ros.on('error', function(error) {
            console.log('Error connecting to websocket server: ', error);
            deferred.reject(true);
        });

        self.ros.on('close', function() {
            console.log('Connection to websocket server closed.');
        });


        return deferred.promise;
    };

    /**
     * List of State Machines
     */
    self.listOfStateMachines = function() {
        self.createRosBridge();
        var deferred = $q.defer();
        console.log(self.ros);
        self.ros.getServicesForType('wires_robotic_platform/SFMCommand', function(list) {
            deferred.resolve(list);
        });
        return deferred.promise;
    };

    /**
     * Retrieves SFM data
     */
    self.getSFMData = function(sfm_name) {
        var deferred = $q.defer();

        var serverProxy = new ROSLIB.Service({
            ros: self.ros,
            name: sfm_name,
            serviceType: 'wires_robotic_platform/SFMCommand'
        });

        var request = new ROSLIB.ServiceRequest({
            request: "{\"command\":\"getGraph\",\"data\":\"1232.132\"}"
        });

        serverProxy.callService(request, function(result) {
            var data = JSON.parse(result.response)
            deferred.resolve(data);
        }, function(e) {
            deferred.reject(e);
        });
        return deferred.promise;
    };

    /**
     * Gets current state for target SFM
     */
    self.getCurrentState = function(sfm_name) {
        var deferred = $q.defer();
        var serverProxy = new ROSLIB.Service({
            ros: self.ros,
            name: sfm_name,
            serviceType: 'wires_robotic_platform/SFMCommand'
        });

        var request = new ROSLIB.ServiceRequest({
            request: "{\"command\":\"getCurrentState\",\"data\":\"1232.132\"}"
        });
        serverProxy.callService(request, function(result) {
            var data = JSON.parse(result.response)
            deferred.resolve(data);
        }, function(e) {
            deferred.reject(e);
        });
        return deferred.promise;
    }




    console.log("ROS PROXY CREATED");
    // factory function body that constructs shinyNewServiceInstance
    return self;
}]);