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
        if (typeof testCaseId === 'undefined' || !coverage) return;

        if (!pendingCoverage[testCaseId]) pendingCoverage[testCaseId] = {};
        const data = pendingCoverage[testCaseId];
        const source = topic.split('/')[1];
        data[source] = coverage;

        if (!data._timeoutStarted) {
            data._timeoutStarted = true;
            setTimeout(() => mergeAndCleanup(testCaseId), 3000);
        }
    } catch (e) {
        console.error(`Error parsing message from ${topic}:`, e.message);
    }
});

function mergeAndCleanup(testCaseId) {
    const data = pendingCoverage[testCaseId];
    if (!data) return;

    const { _timeoutStarted, ...currentCoverages } = data;
    const sources = Object.keys(currentCoverages);
    if (sources.length === 0) {
        delete pendingCoverage[testCaseId];
        return;
    }

    const coverageMap = createCoverageMap({});
    const allSources = new Set([...Object.keys(latestCoverage), ...sources]);

    for (const source of allSources) {
        let cov = currentCoverages[source] || latestCoverage[source];
        if (cov) {
            latestCoverage[source] = JSON.parse(JSON.stringify(cov));
            coverageMap.merge(latestCoverage[source]);
        }
    }

    global.__coverage__ = coverageMap.toJSON();
    delete pendingCoverage[testCaseId];
}

// ----------------- Safe fuzz function -----------------
function fuzz(data) {
    if (!Buffer.isBuffer(data) || data.length === 0 || !connected) return;

    const testCaseId = currentTestCaseId++;
    let obj;

    try {
        obj = JSON.parse(data.toString());
    } catch (_) {
        console.log(`❌ Invalid JSON for testCaseId=${testCaseId}`);
        return;
    }

    // Safely pull values, provide defaults if missing
    const value = typeof obj.value === 'number' ? obj.value : Math.floor(Math.random() * 200);
    const deviceId = typeof obj.deviceId === 'string' ? obj.deviceId : `device-${Math.floor(Math.random() * 1000)}`;
    
    // Safe timestamp: ignore mutated value, use current time
    const timestamp = Date.now();

    const payload = { deviceId, value, timestamp };

    pendingCoverage[testCaseId] = {};

    const TOPIC = "device/test/data";
    client.publish(TOPIC, JSON.stringify(payload), { qos: 0 }, (err) => {
        if (err) console.error("Publish error:", err);
    });
}

module.exports = { fuzz };
