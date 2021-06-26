module.exports = function(RED) {
    function RulesExecuterNode(config) {
        RED.nodes.createNode(this,config);
        this.rulesfilename = config.rulesfilename;
        var node = this;
        node.on('input', function(msg) {
            msg.payload = node.rulesfilename + msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("rules-executer", RulesExecuterNode);
}
