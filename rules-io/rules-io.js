module.exports = function (RED) {
    function RulesIoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.rulesfilename = config.rulesfilename || "";
        this.outputs = config.outputs;
        var nodeContext = this.context();
        node.on('input', function (msg, send, done) {
            var nodeInput = msg;
            delete nodeInput._msgid;
            // This rules are the rules from the rules files stored as context, the value is null when no rules in context found.
            var rules = nodeContext.get("rules_" + node.id) || null;
            var nodeInputs = null;
            if (rules === null) {
                // Read the rules from the rules file and store the rules in the context.
                rules = require(this.rulesfilename);
                nodeContext.set("rules_" + node.id, rules);
                // Read the node input values from the rules and store the values in the context (initial values after restart or deploy).
                nodeInputs = rules.config.input;
                nodeContext.set("inputs_" + node.id, nodeInputs);
            }
            // Read the node input values from the context (the values comes from the previous node action).
            nodeInputs = nodeContext.get("inputs_" + node.id) || null;
            // Create the current node input values with the input of the current node action and store the values in the context.
            nodeInputs = getCurrentInputs(nodeInput, nodeInputs);
            nodeContext.set("inputs_" + node.id, nodeInputs);
            // Determine from the node input values the defined output values from the rules.
            var nodeOutputs = getNodeOutput(nodeInputs, rules.rules);
            // Only for backward compability to Node-RED 0.x.
            send = send || function () { node.send.apply(node, arguments) }
            // Send determined output values to the node outputs.
            node.send(nodeOutputs);
            // Only for backward compability to Node-RED 0.x.
            if (done) {
                done();
            }
        });

        // Function to create the current input node objects.
        function getCurrentInputs(nodeInput, input) {
            var nodeInputs = [];
            for (var i = 0; i < input.length; i++) {
                if (nodeInput.topic === input[i].topic) {
                    nodeInputs.push(nodeInput);
                } else {
                    nodeInputs.push(input[i]);
                }
            }
            return nodeInputs;
        }
        // Function to determine the node output.
        function getNodeOutput(inputs, rules) {
            var nodeOutputs = null;
            for (var i = 0; i < rules.length; i++) {
                var flag = false;
                if (compareTwoListsOfJsonObjects(rules[i].rule.input, inputs) === true) {
                    flag = true;
                    nodeOutputs = rules[i].rule.output;
                    break;
                }
            }
            return nodeOutputs;
        }
        // Function to compare two lists of JSON objects
        function compareTwoListsOfJsonObjects(listA, listB) {
            if (listA.length === listB.length) {
                for (let i in listA) {
                    if (compareTwoJsonObjects(listA[i], listB[i]) === true) {
                        continue;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
            return true;
        }
        // Function to compare two JSON objects.
        function compareTwoJsonObjects(objectA, objectB) {
            if (Object.keys(objectA).length==Object.keys(objectB).length) {
                for (key in objectA) {
                    if (objectA[key] == objectB[key]) {
                        continue;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
            return true;
        }
    }
    RED.nodes.registerType("rules-io", RulesIoNode);
};
 