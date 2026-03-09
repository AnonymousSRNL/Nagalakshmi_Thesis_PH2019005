const mqtt = require('mqtt');

const brokerUrl = 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Actuator connected (AC control)');
  client.subscribe('building/lobby1/ac/command', (err) => {
    if (err) {
      console.error('Subscribe error (AC command):', err);
    } else {
      console.log('Subscribed to AC command topic');
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const cmd = JSON.parse(message.toString());
    console.log('AC command received:', cmd);

    // Simulate AC action
    if (cmd.action === 'setTemp') {
      console.log(`[SIMULATION] Setting AC temp to ${cmd.temp}°C for lobby1`);
    } else {
      console.log('[SIMULATION] Unknown AC command:', cmd);
    }
  } catch (e) {
    console.error('Error parsing AC command message:', message.toString(), e);
  }
});

client.on('error', (err) => {
  console.error('MQTT error (actuator):', err);
});
