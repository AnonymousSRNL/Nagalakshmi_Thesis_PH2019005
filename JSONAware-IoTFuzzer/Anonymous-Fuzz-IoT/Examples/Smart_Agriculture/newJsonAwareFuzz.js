const mqtt = require('mqtt');
const { createCoverageMap } = require('istanbul-lib-coverage');

const client = mqtt.connect('mqtt://localhost:1883');

let connected = false;
let currentTestCaseId = 0;
const pendingCoverage = {};
const latestCoverage = {};

client.on('connect', () => {
  console.log('Fuzzer connected to MQTT broker');
  connected = true;
  client.subscribe('coverage/#');
});

client.on('message', (topic, message) => {
  try {
    const parsed = JSON.parse(message.toString());
    const { testCaseId, coverage } = parsed;
    if (!coverage) return;

    const source = topic.split('/')[1];

    if (!pendingCoverage[testCaseId]) pendingCoverage[testCaseId] = {};
    pendingCoverage[testCaseId][source] = coverage;

    if (!pendingCoverage[testCaseId]._timeoutStarted) {
      pendingCoverage[testCaseId]._timeoutStarted = true;
      setTimeout(() => mergeAndCleanup(testCaseId), 3000);
    }

  } catch (e) {
    console.error("Coverage parse error:", e.message);
  }
});

function mergeAndCleanup(testCaseId) {
  const data = pendingCoverage[testCaseId];
  if (!data) return;

  const { _timeoutStarted, ...coverages } = data;

  const allSources = new Set([...Object.keys(latestCoverage), ...Object.keys(coverages)]);

  const map = createCoverageMap({});

  for (const source of allSources) {
    let cov = coverages[source] || latestCoverage[source];
    if (!cov) continue;

    latestCoverage[source] = JSON.parse(JSON.stringify(cov)); // update
    map.merge(latestCoverage[source]);
  }

  global.__coverage__ = map.toJSON();
  console.log(`Merged coverage for testCaseId ${testCaseId}`);

  delete pendingCoverage[testCaseId];
}

// ----------------------- FUZZ FUNCTION -----------------------

function fuzz(data) {
  if (!Buffer.isBuffer(data) || data.length === 0 || !connected) return;

  const testCaseId = currentTestCaseId++;

  let obj;
  try {
    obj = JSON.parse(data.toString());  // Valid JSON only
  } catch (_) {
    console.log(`❌ Invalid JSON for testCaseId=${testCaseId}`);
    return;
  }

  const shadowUpdate = {
  state: {
    reported: {
      soilMoisture: obj.soilMoisture ?? Math.floor(Math.random()*100),
      temperature: obj.temperature ?? (Math.random()*60 - 10),
      humidity: obj.humidity ?? Math.floor(Math.random()*100),
      cropHealth: obj.cropHealth ?? Math.floor(Math.random()*100)
    }
  },
  thingName: "FieldASensors",
  testCaseId
};

  pendingCoverage[testCaseId] = {};

  const doc = JSON.stringify(shadowUpdate);

client.publish("$aws/things/FieldASensors/shadow/update", doc);
client.publish("$aws/things/FieldASensors/shadow/update/delta", doc);
client.publish("$aws/things/FieldASensors/shadow/update/documents", doc);
client.publish("$aws/things/FieldASensors/shadow/get/accepted", doc);

}
module.exports = { fuzz };
