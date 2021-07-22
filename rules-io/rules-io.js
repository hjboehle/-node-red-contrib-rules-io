module.exports = function (RED) {
    function RulesIoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.rulesfilename = config.rulesfilename || "";
        this.outputs = config.outputs || 1;
        var nodeContext = this.context();
        node.on('input', function (msg, send, done) {
            var rulesJson = nodeContext.get("rulesJson_" + node.id) || null;
            // are there no rules stored in context rules, will the rules reading from the rules file and storing in context
            if (rulesJson === null) {
                rulesJson = require(this.rulesfilename);
                nodeContext.set("rulesJson_" + node.id, rulesJson);
                // call the function to create and store the status information in context
                statusJson = createStatus(rulesJson)
            }

            // adjustment of the status due to the input parameters
            statusJson = adjustStatus(statusJson, msg.topic, msg.payload, rulesJson.rules);
            node.log("status: " + JSON.stringify(statusJson));
            nodeContext.set("statusJson_" + node.id, statusJson);

            // only for backward compability to Node-Red 0.x
            send = send || function () { node.send.apply(node, arguments) }

            // send rule output to node output
            msg.payload = "topic: " + msg.topic +", value: " + msg.payload;
            send(msg);

            // only for backward compability to Node-Red 0.x
            if (done) {
                done();
            }
        });
        // function to create and store the status information in context
        function createStatus(rulesJson) {
            statusJson = rulesJson.config;
            for (var i = 0; i < statusJson.input.length; i++) {
                statusJson.input[i].value = statusJson.input[i].inititalValue;
                delete statusJson.input[i].inititalValue;
            }
            for (var i = 0; i < statusJson.output.length; i++) {
                statusJson.output[i].value = statusJson.output[i].inititalValue;
                delete statusJson.output[i].inititalValue;
            }
            return statusJson;
        }

        // function to adjust the status with the input and output parameters
        function adjustStatus(status, topic, value, rules) {
            for (var i = 0; i < status.input.length; i++) {
                if (topic === status.input[i].topic) {
                    status.input[i].value = value;
                }
            }
            for (var i = 0; i < rules.length; i++) {
                if (JSON.stringify(rules[i].rule.input) === JSON.stringify(status.input)) {
                    status.output = rules[i].rule.output;
                }
            }
            return status;
        }
    }
    RED.nodes.registerType("rules-io", RulesIoNode);
};
 