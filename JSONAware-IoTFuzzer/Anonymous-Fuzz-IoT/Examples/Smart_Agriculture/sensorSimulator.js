const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log("Sensor simulator connected.");
  
  setInterval(() => {
    const payload = {
      state: {
        reported: {
          soilMoisture: Math.floor(Math.random() * 80),   // 0–79
          temperature: Math.floor(Math.random() * 45),    // 0–44
          humidity: Math.floor(Math.random() * 100),      // 0–99
          cropHealth: ["Good", "Moderate", "Poor"][Math.floor(Math.random() * 3)]
        }
      },
      thingName: "FieldASensors"
    };

    client.publish(
      "$aws/things/FieldASensors/shadow/update/documents",
      JSON.stringify(payload)
    );

    console.log("Published sensor update:", payload);
  }, 3000);
});
