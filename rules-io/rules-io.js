module.exports = function (RED) {
    function RulesIoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.rulesfilename = config.rulesfilename || "";
        this.outputs = config.outputs || 1;
        var nodeContext = this.context();
        node.on('input', function (msg, send, done) {
            var rules = nodeContext.get("rules_" + node.id) || null;
            // are there no rules stored in context rules, will the rules reading from the rules file and storing in context
            if (rules === null) {
                rules = require(this.rulesfilename);
                nodeContext.set("rules_" + node.id, rules);
                // call the function to create and store the status information in context
                status = rules.config;
            }

            // adjustment of the status due to the input parameters
            status = adjustStatus(status, msg.topic, msg.payload, rules.rules);
            node.log("status: " + JSON.stringify(status) + ", outputMessages: " + JSON.stringify(status.output));
            nodeContext.set("status_" + node.id, status);

            // only for backward compability to Node-RED 0.x
            send = send || function () { node.send.apply(node, arguments) }

            // send rule output to node output
            node.send(status.output);

            // only for backward compability to Node-RED 0.x
            if (done) {
                done();
            }
        });

        // function to adjust the status with the input and output parameters
        function adjustStatus(status, topic, payload, rules) {
            for (var i = 0; i < status.input.length; i++) {
                if (topic === status.input[i].topic) {
                    status.input[i].payload = payload;
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
 