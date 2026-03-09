// device.js — Real MQTT Device with LWT + Telemetry

const mqtt = require("mqtt");

const deviceName = "device-19";

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: deviceName,
  clean: true,

  // Last Will Message (LWT)
  will: {
    topic: "sensor/status",
    payload: JSON.stringify({
      sensorId: deviceName,
      status: "dead",
      timestamp: new Date().toISOString()
    }),
    qos: 1,
    retain: false
  }
});

// Fired when device successfully connects
client.on("connect", () => {
  console.log(`[${deviceName}] Connected to MQTT broker`);

  // Normal telemetry publish
  const dataPayload = {
    sensorId: deviceName,
    timestamp: new Date().toISOString(),
    temperature: 41.2,
    pressure: 108.4
  };

  console.log(`[${deviceName}] Publishing DATA:`, dataPayload);

  client.publish("sensor/data", JSON.stringify(dataPayload), { qos: 0 }, () => {
    console.log(`[${deviceName}] Data publish success`);

    // Graceful disconnect (LWT will NOT fire)
    setTimeout(() => {
      console.log(`[${deviceName}] Graceful disconnect`);
      client.end();
    }, 2000);
  });
});

// Fired if connection fails
client.on("error", (err) => {
  console.error(`[${deviceName}] Connection error:`, err);
});
