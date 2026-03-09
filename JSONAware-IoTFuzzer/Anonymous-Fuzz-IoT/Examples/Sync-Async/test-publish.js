const mqtt = require('mqtt');

// Change this URL to your broker address, e.g. localhost if running Mosquitto locally
const brokerUrl = 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);



const TOPIC = "device/test/data";

client.on('connect', () => {
  console.log("Connected to MQTT broker");

  // Send a few test messages
  for (let i = 0; i < 5; i++) {
    const payload = {
      deviceId: `device-${Math.floor(Math.random()*1000)}`,
      value: Math.floor(Math.random() * 200),
      timestamp: Date.now()
    };
    client.publish(TOPIC, JSON.stringify(payload), { qos: 0 }, (err) => {
      if (err) console.error("Publish error:", err);
      else console.log("Published:", payload);
    });
  }

  // Close after a short delay
  setTimeout(() => {
    client.end();
  }, 2000);
});

client.on('error', (err) => {
  console.error("MQTT client error:", err);
});
