// newJsonAwareFuzz.js
const mqtt = require('mqtt');
require('./ruleEngine'); // load RuleEngine in the SAME process

const client = mqtt.connect('mqtt://localhost:1883');

let connected = false;
let currentTestCaseId = 0;

client.on('connect', () => {
  console.log('[Fuzzer] Connected to MQTT broker');
  connected = true;
});

function fuzz(data) {
  if (!Buffer.isBuffer(data) || data.length === 0 || !connected) return;

  const testCaseId = currentTestCaseId++;
  let obj;

  try {
    obj = JSON.parse(data.toString('utf-8'));
  } catch {
    console.log(`❌ Invalid JSON for testCaseId=${testCaseId}`);
    return;
  }

  const topic =
    obj.topic === 'sensor/status'
      ? 'sensor/status'
      : 'sensor/data';

  const message = {
    sensorId: obj.sensorId || 'device-lwt',
    timestamp: obj.timestamp || new Date().toISOString(),
    temperature: obj.temperature,
    pressure: obj.pressure,
    status: obj.status || (topic === 'sensor/status' ? 'offline' : 'ok'),
    testCaseId
  };

  client.publish(topic, JSON.stringify(message));
  console.log(`🧪 testCaseId=${testCaseId} → Published to ${topic}`, message);
}

module.exports = { fuzz };
