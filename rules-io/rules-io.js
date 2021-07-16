module.exports = function (RED) {
    function RulesIoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.rulesfilename = config.rulesfilename || "";
        var nodeContext = this.context();
        node.on('input', function (msg, send, done) {
            var rulesJson = nodeContext.get("rulesJson_" + node.id) || null;
            if (rulesJson === null) {
                node.log("read rules from file and store in context: " + "rulesJson_" + node.id);
                rulesJson = require(this.rulesfilename);
                nodeContext.set("rulesJson_" + node.id, rulesJson);
                statusJson = createStatus(rulesJson)
            }

            send = send || function () { node.send.apply(node, arguments) }
            msg.payload = rulesJson;
            node.log("before send");
            send(msg);

            if (done) {
                done();
            }
        });
        function createStatus(rulesJson) {
            node.log("function addStatus");
            statusJson = rulesJson.config;
            for (var i = 0; i < statusJson.input.length; i++) {
                statusJson.input[i].value = statusJson.input[i].inititalValue;
                delete statusJson.input[i].inititalValue;
            }
            for (var i = 0; i < statusJson.output.length; i++) {
                statusJson.output[i].value = statusJson.output[i].inititalValue;
                delete statusJson.output[i].inititalValue;
            }
            nodeContext.set("statusJson_" + node.id, statusJson);
            node.log("statusJson: " + JSON.stringify(statusJson));
            return statusJson;
        }
    }
    RED.nodes.registerType("rules-io", RulesIoNode);
};
