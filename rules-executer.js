module.exports = function (RED) {
    var fs = require("fs");
    function RulesExecuterNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.rulesfilename = config.rulesfilename || "";
        this.loadedRules = "";
        var nodeContext = this.context();
        nodeContext.set("rulesJson", "haha1");
        node.on('input', function (msg, send, done) {

            if (this.rulesfilename === "") {
                // follow https://github.com/emiloberg/node-red-contrib-file-function/blob/master/file-function/file-function.js
                node.warn("No rules filename specified");
            } else {
                fs.readFile(this.rulesfilename, 'utf-8', function (err, data) {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            node.warn('Could not find rules file "' + err.path + '". Hint: File path is relative to "' + process.env.PWD + '"');
                        } else {
                            node.warn(err);
                        }
                    } else {
                        node.log("read rules file");
                        writeRulesToNodeContext(data);
                    }
                });
            }

            rulesJson = nodeContext.get("rulesJson");
            var msg = { payload: rulesJson };
            node.send(msg);

        });
        function writeRulesToNodeContext(rules) {
            node.log("write rules to context");
            nodeContext.set("rulesJson", JSON.parse(rules));
        }
    }
    RED.nodes.registerType("rules-executer", RulesExecuterNode);
};
