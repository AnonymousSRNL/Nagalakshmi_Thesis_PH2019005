const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const handler = require('./i_lambdaDecisionMaker'); // your Lambda

client.on('connect', () => {
  console.log("Rule Engine connected.");
  client.subscribe("$aws/things/FieldASensors/shadow/update/documents");
});

client.on('message', async (topic, message) => {
  try {
    const parsed = JSON.parse(message.toString());
    console.log("Rule Engine triggered:", parsed);

    const response = await handler.handler(parsed);
    console.log("Lambda returned:", response);

  } catch (err) {
    console.error("Rule Engine Error:", err.message);
  }
});
