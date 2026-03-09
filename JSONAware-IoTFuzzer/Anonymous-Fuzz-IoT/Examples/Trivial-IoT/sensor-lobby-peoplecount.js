const mqtt = require('mqtt');

// Change this URL to your broker address, e.g. localhost if running Mosquitto locally
const brokerUrl = 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Sensor connected (lobby peoplecount)');

  setInterval(() => {
    const peopleCount = Math.floor(Math.random() * 30);
    const payload = {
      peopleCount,
      timestamp: Date.now(),
      lobbyId: 'lobby1'
    };
    client.publish(
      'building/lobby1/peoplecount',
      JSON.stringify(payload)
    );
    console.log('Published people count:', payload);
  }, 5000);
});

client.on('error', (err) => {
  console.error('MQTT error (peoplecount):', err);
});
