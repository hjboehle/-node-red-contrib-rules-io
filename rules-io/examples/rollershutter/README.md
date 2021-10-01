# Homeautomation for Rollershutters

"Homeautomation for Rollershutters" is an example of the "rules-io" node. It is a practible example to understand the functionality.

## Description Of The Example

After you import the flow with the file [flow_rollershutter.json](flow_rollershutter.json) there will be the following nodes:

* 6 "inject" nodes to send values and topics to the input of the node "rules-io". Thos nodes simulates natural parameteres (twilight, sunlight incident, time period) for control rollershutters.
* 3 "rules-io" nodes for the three different rooms. The filled in fields "File Name" must be filled with the following file names (Note: It is possible that the file name must be adjusted. The file name should be absolute or relative to the work directory of the Node-RED processes.):
  * living room: [rules_rollershutter_living-room.json](rules_rollershutter_living-room.json),
  * kitchen: [rules_rollershutter_kitchen.json](rules_rollershutter_kitchen.json),
  * bedroom: [rules_rollershutter_bedroom.json](rules_rollershutter_bedroom.json)
* 3 "debug" nodes with the outputs for the values in percent for closing the rollershutters.

Feel free to try out the flow and understand its function.

## files in examples

* [flow_rollershutter.json](flow_rollershutter.json) is the flow to import into Node-RED
* [rules_rollershutter_living-room.json](rules_rollershutter_living-room.json) is the file for the living room you have to enter into the node-field "File Name"
* [rules_rollershutter_kitchen.json](rules_rollershutter_kitchen.json) is the file for the kitchen you have to enter into the node-field "File Name"
* [rules_rollershutter_bedroom.json](rules_rollershutter_bedroom.json) is the file for the bedroom you have to enter into the node-field "File Name"
