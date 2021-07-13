module.exports = function (RED) {
    function RulesIoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.rulesfilename = config.rulesfilename || "";
        var nodeContext = this.context();
        node.on('input', function (msg, send, done) {
            var rulesJson = nodeContext.get("rulesJson_" + node.id) || null;
            if (rulesJson === null) {
                rulesJson = require(this.rulesfilename);
                nodeContext.set("rulesJson" + node.id, rulesJson);
            }

            send = send || function () { node.send.apply(node, arguments) }
            msg.payload = rulesJson;
            send(msg);

            if (done) {
                done();
            }
        });
    }
    RED.nodes.registerType("rules-io", RulesIoNode);
};
