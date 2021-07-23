# Conversion Of 4 Bit Numbers

"Conversion of 4 Bit Numbers" is an example of the "rules-io" node. It is a theoretical example but it shows the functionality very transparent.

## Description Of The Example

After import of the flow with the file [flow_4bits.json](flow_3bits.json) there are the follow nodes:

* 8 "inject" nodes to send values and topics to the input of the node "rules-io".
* 1 "rules-io" node with the filled field "File Name" [rules_4bits.json](rules_3bits.json). Note: It is possible that the file name must adjust. The file name should absolute or relative to the work directory of the Node-RED processes.
* 2 "debug" node with the outputs for the decimal and the hexadecimal number.

Feel free to try it out the flow and understand the functionality.

## files in examples

* [flow_4bits.json](flow_3bits.json) is the flow to import in Node-RED
* [rules_4bits.json](rules_3bits.json) is the file to enter in the node-field "File Name"
