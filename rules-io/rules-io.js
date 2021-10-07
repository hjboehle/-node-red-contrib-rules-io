module.exports = function (RED) {
    function RulesIoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.name = config.name || "";
        this.rulesfilename = config.rulesfilename || "";
        this.outputs = config.outputs;
        var nodeContext = this.context();
        node.on('input', function (msg, send, done) {
            // Extract input values from the message. 
            var nodeInput = {
                "topic": msg.topic,
                "payload": msg.payload
            };
            // Create the log entry and write the first informations in it
            var logEntry = getLogEntry(this.name, this.rulesfilename, nodeInput)
            logEntry.metaInformation.previousInputOutput = "from context";
            logEntry.statusInformation.sectionName = "message received";
            logEntry.inputMessages.receivedInput = nodeInput;
            // This rules are the rules from the rules files stored as context, the value is null when no rules in context found.
            var rules = nodeContext.get("rules_" + node.id) || null;
            var nodeInputs = null;
            if (rules === null) {
                // Read the rules from the rules file and store the rules in the context.
                logEntry.statusInformation.sectionName = "read rules file";
                try {
                    rules = require(this.rulesfilename);
                    logEntry.metaInformation.previousInputOutput = "from rulesfile";
                } catch (e) {
                    logEntry.statusInformation.sectionName = "read rules file";
                    logEntry.statusInformation.errorMessage = e;
                    node.log(JSON.stringify(logEntry));
                    exit(1);
                }
                // Write rules in the context.
                try {
                    nodeContext.set("rules_" + node.id, rules);
                } catch (e) {
                    logEntry.statusInformation.sectionName = "write rules in context";
                    logEntry.statusInformation.errorMessage = e;
                    node.log(JSON.stringify(logEntry));
                    exit(2);
                }
                // Read the node input values from the rules and store the values in the context (initial values after restart or deploy).
                nodeInputs = rules.config.input;
                try {
                    nodeContext.set("inputs_" + node.id, nodeInputs);
                } catch (e) {
                    logEntry.statusInformation.sectionName = "write previous node inputs in context";
                    logEntry.statusInformation.errorMessage = e;
                    node.log(JSON.stringify(logEntry));
                    exit(3);
                }
            }
            // Read the node input values from the context (the values comes from the previous node action).
            try {
                nodeInputs = nodeContext.get("inputs_" + node.id) || null;
                logEntry.inputMessages.previousInputs = nodeInputs;
            } catch (e) {
                logEntry.statusInformation.sectionName = "read previous node inputs from context";
                logEntry.statusInformation.errorMessage = e;
                node.log(JSON.stringify(logEntry));
                exit(4);
            }
            // Create the current node input values with the input of the current node action and store the values in the context.
            try {
                nodeInputs = getCurrentInputs(nodeInput, nodeInputs);
                logEntry.inputMessages.currentInputs = nodeInputs;
            } catch (e) {
                logEntry.statusInformation.sectionName = "create current node inputs";
                logEntry.statusInformation.errorMessage = e;
                node.log(JSON.stringify(logEntry));
                exit(5);
            }
            // Write the current node inputs in the context for the next node call.
            try {
                nodeContext.set("inputs_" + node.id, nodeInputs);
            } catch (e) {
                logEntry.statusInformation.sectionName = "write current node inputs in context";
                logEntry.statusInformation.errorMessage = e;
                node.log(JSON.stringify(logEntry));
                exit(6);
            }
            // Determine from the node input values the defined output values from the rules.
            try {
                var nodeOutputs = getNodeOutput(nodeInputs, rules.rules);
                node.log("nodeOutputs: " + JSON.stringify(nodeOutputs));
                logEntry.outputMessages.currentOutputs = nodeOutputs;
                node.log("logEntry: " + JSON.stringify(logEntry));
            } catch (e) {
                logEntry.statusInformation.sectionName = "determine current node outputs";
                logEntry.statusInformation.errorMessage = e;
                node.log(JSON.stringify(logEntry));
                exit(7);
            }
            // Only for backward compability to Node-RED 0.x.
            send = send || function () { node.send.apply(node, arguments) }
            // Send determined output values to the node outputs.
            logEntry.statusInformation.sectionName = "send current node outputs";
            try {
                node.send(nodeOutputs);
                node.log(JSON.stringify(logEntry));
            } catch (e) {
                logEntry.statusInformation.errorMessage = e;
                node.log(JSON.stringify(logEntry));
                exit(8);
            }
            // Only for backward compability to Node-RED 0.x.
            if (done) {
                done();
            }
        });

        // Function to create the log entry
        function getLogEntry(name, rulesfilename, input) {
            var logEntry = {
                "metaInformation": {
                    "nodeName": name,
                    "rulesFileName": rulesfilename,
                    "previousInputOutput": "from context"
                },
                "statusInformation": {
                    "sectionName": "",
                    "errorMessage": "",
                },
                "inputMessages": {
                    "receivedInput": input,
                    "previousInputs": "",
                    "currentInputs": ""
                },
                "outputMessages": {
                    "currentOutputs": ""
                }
            };
            return logEntry;
        }
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