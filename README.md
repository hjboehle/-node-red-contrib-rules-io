# node-red-contrib-rules-io

Generic rules node for Node-RED, that executes file-based rules in Json format. Documents your automation rules in a Json file and execute this rules directly with the "rules-io" node. The node send (output) the wanted messages after receiving a message (input).

## Installation

The recommended way is to install the node directly from Node-RED under "Manage palette" an the tab "Installation".

By manually installation download this repository an go to your download directory and enter

    npm install <your_download_directory>

## Configuration

The following sections describes the configuration. For a better understanding please have a look of the [examples](rules-io/examples).

### Rule File Creation

First of all you must create a rules file. The rules file contains a Json object with the following keys:

* metadata
* config
* rules

In the next sections you find the descriptions of this keys. The explanations of the values are given in the angle brackets.

#### Metadata

The value of the metadata key is object with the following key value pairs:

    "metadata": {
        "rule_name": "<name of the rules by your choice>",
        "rule_description": "<description of the rules by your choice>",
        "environment": "<information where the rules have an impact, for example inside or outside>",
        "area": "<extended information where the rules have an inpact, for example kitchen or car port>"
    },

All metadata have nor impact of the functionality. All metadata helps you to differences between your rules for your other rules. Only the rule name is a parameter in the node log.

#### Config

The value of the config key is an object contains two lists with input objects and output objects. The config key shows the basic structure of the rules. Every rule must build by this structure.

    "config": {
        "input": [
            {
                "topic": "<unique string that describes the input>",
                "initialValue": "<value by start or restart of Node-RED or by a deployment>"
            },

            ...

            {
                "topic": "<unique string that describes the input>",
                "initialValue": "<value by start or restart of Node-RED or by a deployment>"
            }
        ],
        "output": [
            {
                "topic": "<unique string that describes the output>",
                "initialValue": "<value by start or restart of Node-RED or by a deployment>"
            },

            ...

            {
                "topic": "<unique string that describes the output>",
                "initialValue": "<value by start or restart of Node-RED or by a deployment>"
            }
        ]
    },

#### Rules

The value of the rules key is a list contains rule objects in the same structure as the config key.

    "rules": [
        {
            "rule": {
                "input": [
                    {
                        "topic": "<unique string that describes the input>",
                        "value": "<value by start or restart of Node-RED or by a deployment>"
                    },

            ...

                    {
                        "topic": "<unique string that describes the input>",
                        "value": "<value by start or restart of Node-RED or by a deployment>"
                    }
                ],
                "output": [
                    {
                        "topic": "<unique string that describes the output>",
                        "value": "<value by start or restart of Node-RED or by a deployment>"
                    },

            ...

                    {
                        "topic": "<unique string that describes the output>",
                        "value": "<value by start or restart of Node-RED or by a deployment>"
                    }
                ]
            }
        },

        ...

For every combination of input lists must exist an output list. If this not given the "rules-io" node don't send output messages for the undefined input lists.

### Node Form

After creating the rules file it is possible to use the "rules-io" node. Therefore must entered the form fields of the node:

* Name - name of the rule by your choice
* File Name (rules file name) - file name of the rules file (note: the file name must be absolute or relative to the work directory of Node-RED)
* Outputs - the number of outputs, this number must the same number of objects in the output lists of the rules.

## License

Apache License 2.0
