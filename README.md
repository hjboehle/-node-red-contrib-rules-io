# node-red-contrib-rules-io

Rules node for Node-RED, that executes file-based rules in Json format. Documents your automation rules in a Json file and executes this rules directly with the "rules-io" node. The node sends (output) the wanted messages after receiving a message (input).

In the "rules-io" node it is possible define necessary rule by "Low Code".

## Installation

The recommended way is to install the node directly from Node-RED under "Manage palette" and the tab "Installation".

By manual installation, download this repository and go to your download directory and enter

    npm install <your_download_directory>

## Configuration

The following sections describe the configuration. For a better understanding please have a look at the [examples](https://github.com/hjboehle/node-red-contrib-rules-io/rules-io/examples).

### Rule File Creation

First of all you must create a rules file. By writing the rules file the Json schema file [rules-schema.json](https://github.com/hjboehle/node-red-contrib-rules-io/rules-io/rules-schema.json) supports you. The rules file contains a Json object with the following keys:

* metadata
* config
* rules

In the next sections you will find the descriptions of this keys. The explanations of the values are given in the angle brackets.

#### Metadata

The value of the metadata key is an object with the following key value pairs:

    "metadata": {
        "rule_name": "<name of the rules by your choice>",
        "rule_description": "<description of the rules by your choice>",
        "environment": "<information where the rules have an impact, for example inside or outside>",
        "area": "<extended information where the rules have an inpact, for example kitchen or car port>"
    },

All metadata have no impact on the functionality. All metadata helps you to differentiate between your rules. Only the rule name is a parameter in the node log.

#### Config

The value of the config key is an object containing two lists with input objects and output objects. The config key shows the basic structure of the rules. Every rule must be build according to this structure.

    "config": {
        "input": [
            {
                "topic": "<unique string that describes the input>",
                "payload": "<value by start or restart of Node-RED or by a deployment>"
            },

            ...

            {
                "topic": "<unique string that describes the input>",
                "payload": "<value by start or restart of Node-RED or by a deployment>"
            }
        ],
        "output": [
            {
                "topic": "<unique string that describes the output>",
                "payload": "<value by start or restart of Node-RED or by a deployment>"
            },

            ...

            {
                "topic": "<unique string that describes the output>",
                "payload": "<value by start or restart of Node-RED or by a deployment>"
            }
        ]
    },

#### Rules

The value of the rules key is a list containing rule objects in the same structure as the config key.

    "rules": [
        {
            "rule": {
                "input": [
                    {
                        "topic": "<unique string that describes the input>",
                        "payload": "<value by start or restart of Node-RED or by a deployment>"
                    },

            ...

                    {
                        "topic": "<unique string that describes the input>",
                        "payload": "<value by start or restart of Node-RED or by a deployment>"
                    }
                ],
                "output": [
                    {
                        "topic": "<unique string that describes the output>",
                        "payload": "<value by start or restart of Node-RED or by a deployment>"
                    },

            ...

                    {
                        "topic": "<unique string that describes the output>",
                        "payload": "<value by start or restart of Node-RED or by a deployment>"
                    }
                ]
            }
        },

        ...

For every combination of input lists there must exist an output list. If this is not given the "rules-io" node won't send output messages for the undefined input lists.

### Node Form

After creating the rules file it is possible to use the "rules-io" node. For this the form fields of the node must be filled in as follows:

* Name - name of the rule of your choice
* File Name (rules file name) - file name of the rules file (note: the file name must be absolute or relative to the work directory of Node-RED)
* Outputs - the number of outputs, this number must be the same number as objects in the output lists of the rules.

## License

Apache License 2.0
