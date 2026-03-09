const mqtt = require("mqtt");
const lambdaVitals = require("./i_lambdaVitals");
const lambdaInventory = require("./i_lambdaInventory");

function safeJSON(str) {
  try { return JSON.parse(str); }
  catch { return null; }
}

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Rule Engine Connected");
  client.subscribe("aws/things/SmartHeartRateMonitor/shadow/update/documents");
});

client.on("message", async (_, message) => {
  const event = safeJSON(message.toString());
  if (!event) {
    console.log("❌ Dropped invalid JSON:", message.toString());
    return;
  }

  // Add testCaseId if missing, for fuzzer coverage tracking
  if (!event.testCaseId) event.testCaseId = Math.floor(Math.random() * 1e6);

  try {
    await lambdaVitals.handler(event, client);
    await lambdaInventory.handler(event); // make sure inventory also publishes coverage
  } catch (err) {
    console.error("Handler Error:", err);
  }

  // Controller coverage
  if (global.__coverage__) {
    client.publish(
      "coverage/controller",
      JSON.stringify({ testCaseId: event.testCaseId, coverage: global.__coverage__ })
    );
  }
});
