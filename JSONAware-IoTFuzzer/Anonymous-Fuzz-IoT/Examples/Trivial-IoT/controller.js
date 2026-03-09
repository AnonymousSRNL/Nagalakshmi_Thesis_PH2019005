const mqtt = require('mqtt');

const brokerUrl = 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);

const HIGH_PEOPLE_THRESHOLD = 20;
const LOW_PEOPLE_THRESHOLD = 5;

client.on('connect', () => {
  console.log('Controller connected to broker');

  client.subscribe('building/+/peoplecount', (err) => {
    if (err) {
      console.error('Subscribe error (peoplecount):', err);
    } else {
      console.log('Subscribed to peoplecount topics');
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const { peopleCount, lobbyId, timestamp } = payload;

    console.log('People count event:', payload);

    let cmd = null;

    if (peopleCount > HIGH_PEOPLE_THRESHOLD) {
      cmd = {
        action: 'setTemp',
        temp: 20,
        timestamp
      };
    } else if (peopleCount < LOW_PEOPLE_THRESHOLD) {
      cmd = {
        action: 'setTemp',
        temp: 24,
        timestamp
      };
    } else {
      console.log('People count in comfortable range. No change.', peopleCount);
    }

    if (cmd) {
      const commandTopic = `building/${lobbyId}/ac/command`;
      client.publish(commandTopic, JSON.stringify(cmd));
      console.log('Published AC command:', cmd);
    }
  } catch (e) {
    console.error('Error processing peoplecount message:', message.toString(), e);
  }
});

client.on('error', (err) => {
  console.error('MQTT error (controller):', err);
});
