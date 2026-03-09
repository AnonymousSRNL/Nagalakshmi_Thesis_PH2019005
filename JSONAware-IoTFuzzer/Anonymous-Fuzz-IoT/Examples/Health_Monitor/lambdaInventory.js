const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:1883");

exports.handler = async (event) => {
  try {
    const batteryLevel = event?.state?.reported?.batteryLevel;

    if (typeof batteryLevel !== "number") {
      console.log("Inventory Lambda: Invalid batteryLevel");
      return;
    }

    // normal logic

  } catch (err) {
    console.log("Inventory Handler Error:", err.message);
  }

  // ---- SEND COVERAGE BACK ----
  if (global.__coverage__) {
    client.publish(
      "coverage/inventory",
      JSON.stringify({ testCaseId: event.testCaseId, coverage: global.__coverage__ })
    );
  }
};
