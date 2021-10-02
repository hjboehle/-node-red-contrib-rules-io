# Conversion Of 4 Bit Numbers

"Conversion of 4 Bit Numbers" is an example of the "rules-io" node. It is a theoretical example but it shows the functionality very well.

## Description Of The Example

After you import the flow with the file [flow_4bits.json](https://github.com/hjboehle/node-red-contrib-rules-io/blob/main/rules-io/examples/4bits/flow_4bits.json) there will be the following nodes:

* 8 "inject" nodes to send values and topics to the input of the node "rules-io".
* 1 "rules-io" node with the filled in field "File Name" [rules_4bits.json](https://github.com/hjboehle/node-red-contrib-rules-io/blob/main/rules-io/examples/4bits/rules_4bits.json). Note: It is possible that the file name must be adjusted. The file name should be absolute or relative to the work directory of the Node-RED processes.
* 2 "debug" nodes with the outputs for the decimal and the hexadecimal numbers.

Feel free to try out the flow and understand its function.

## files in examples

* [flow_4bits.json](https://github.com/hjboehle/node-red-contrib-rules-io/blob/main/rules-io/examples/4bits/flow_4bits.json) is the flow to import into Node-RED
* [rules_4bits.json](https://github.com/hjboehle/node-red-contrib-rules-io/blob/main/rules-io/examples/4bits/rules_4bits.json) is the file you have to enter into the node-field "File Name"
