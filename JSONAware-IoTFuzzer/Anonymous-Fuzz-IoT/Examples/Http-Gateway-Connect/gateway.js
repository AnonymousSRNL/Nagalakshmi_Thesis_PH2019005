const mqtt = require("mqtt");
//const axios = require("axios");

const BROKER = "mqtt://localhost:1883";
const TOPIC = "devices/+/data";
const REST_URL = "http://localhost:3000/endpoint";

const client = mqtt.connect(BROKER);

client.on("connect", () => {
  console.log("Connected — subscribing to", TOPIC);
  client.subscribe(TOPIC, (err) => {
    if (err) console.error("Subscribe error:", err);
  });
});

client.on("message", async (topic, msg) => {
  try {
    const obj = JSON.parse(msg.toString());
    await axios.post(REST_URL, obj);
    console.log("Posted to REST:", obj);
  } catch (e) {
    console.error("Error in gateway:", e, "raw:", msg.toString());
  }
});
