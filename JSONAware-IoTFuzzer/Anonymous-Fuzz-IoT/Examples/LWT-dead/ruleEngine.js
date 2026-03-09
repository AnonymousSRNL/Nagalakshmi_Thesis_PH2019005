// ruleEngine.js
const mqtt = require('mqtt');
const handleDataStatus = require('./lambda-data-status-handler');
const handleAlarm = require('./lambda-alarm-handler');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('[RuleEngine] Connected');
  client.subscribe('sensor/data');
  client.subscribe('sensor/status');
  console.log('[RuleEngine] Subscribed to sensor/data and sensor/status');
});

client.on('message', async (topic, message) => {
  console.log(`\n[RuleEngine] Message on '${topic}': ${message.toString()}`);

  let payload;
  try {
    payload = JSON.parse(message.toString());
  } catch {
    console.error('[RuleEngine] Invalid JSON');
    return;
  }

  const event = {
    sensorId: payload.sensorId || 'device-lwt',
    timestamp: payload.timestamp || new Date().toISOString(),
    temperature: payload.temperature,
    pressure: payload.pressure,
    status: payload.status || (topic === 'sensor/status' ? 'offline' : 'ok'),
    testCaseId: payload.testCaseId
  };

  if (topic === 'sensor/data') {
    console.log('[RuleEngine] → lambda-data-status-handler');
    await handleDataStatus(event);
  }

  if (topic === 'sensor/status') {
    console.log('[RuleEngine] → lambda-data-status-handler');
    await handleDataStatus(event);

    console.log('[RuleEngine] → lambda-alarm-handler');
    await handleAlarm(event);
  }
});

module.exports = { client };
