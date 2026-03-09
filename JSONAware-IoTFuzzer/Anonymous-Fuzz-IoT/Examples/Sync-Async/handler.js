const mqtt = require('mqtt');

const brokerUrl = 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Connected to broker');
  client.subscribe('device/test/data', (err) => {
    if (err) {
      console.error('Subscribe error:', err);
    } else {
      console.log('Subscribed to topic device/test/data');
    }
  });
});

client.on('message', (topic, message) => {
  // wrap in async IIFE so you can use await
  (async () => {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (err) {
      console.error("Invalid JSON payload:", err);
      return;
    }

    const deviceId = payload.deviceId || payload.id || 'unknown';
    const value = payload.value;

    console.log(`Device ${deviceId} sent value ${value}`);

    // asynchronous work, e.g. DB call, delay, external I/O
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Async work done after 1s delay");

    if (value !== undefined && value > 100) {
      console.log(`⚠️ Value too high (${value}) — alert logic here`);
      // e.g. alert, persist to DB, publish another MQTT, etc.
    }
  })().catch(err => {
    console.error("Error processing message:", err);
  });
});

// optionally handle errors
client.on('error', err => {
  console.error("MQTT client error:", err);
});

