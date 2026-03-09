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

        if (!pendingCoverage[testCaseId]) {
            pendingCoverage[testCaseId] = {};
        }
        const data = pendingCoverage[testCaseId];
        const source = topic.split('/')[1]; // controller, ac, etc.
        data[source] = coverage;

        if (!data._timeoutStarted) {
            data._timeoutStarted = true;
            setTimeout(() => mergeAndCleanup(testCaseId), 3000);
        }
    } catch (e) {
        console.error(`Error parsing coverage:`, e.message);
    }
});

function mergeAndCleanup(testCaseId) {
    const data = pendingCoverage[testCaseId];
    if (!data) return;

    const { _timeoutStarted, ...currentCoverages } = data;
    const sourcesThisCase = Object.keys(currentCoverages);

    if (sourcesThisCase.length === 0) {
        console.log(`No coverage received for testCaseId ${testCaseId}`);
        delete pendingCoverage[testCaseId];
        return;
    }

    const coverageMap = createCoverageMap({});
    const allSources = new Set([
        ...Object.keys(latestCoverage),
        ...sourcesThisCase
    ]);

    for (const source of allSources) {
        let coverageToMerge;
        if (currentCoverages[source]) {
            coverageToMerge = JSON.parse(JSON.stringify(currentCoverages[source]));
            latestCoverage[source] = coverageToMerge;
        } else if (latestCoverage[source]) {
            coverageToMerge = JSON.parse(JSON.stringify(latestCoverage[source]));
        }

        if (coverageToMerge) coverageMap.merge(coverageToMerge);
    }

    global.__coverage__ = coverageMap.toJSON();
    console.log(`Merged coverage for sources: ${Array.from(allSources).join(', ')}`);

    delete pendingCoverage[testCaseId];
}

function fuzz(data) {
    if (!Buffer.isBuffer(data) || data.length === 0 || !connected) return;

    const testCaseId = currentTestCaseId++;

    let obj;
    try {
        obj = JSON.parse(data.toString());
    } catch (e) {
        console.log(`❌ Invalid JSON for testCaseId=${testCaseId}`);
        return;
    }

    // The MOST IMPORTANT FIX:
    // Use fuzzed value if present, else default 0–29
    let peopleCount = obj.peopleCount;
    if (typeof peopleCount !== 'number' || isNaN(peopleCount)) {
        peopleCount = Math.floor(Math.random() * 30);
    }

    const payload = {
        testCaseId,        // REQUIRED so controller sends coverage
        peopleCount,
        timestamp: Date.now(),
        lobbyId: "lobby1"
    };

    pendingCoverage[testCaseId] = {};

    client.publish(
        "building/lobby1/peoplecount",
        JSON.stringify(payload)
    );

    console.log(`🧪 Sent testCaseId=${testCaseId}, peopleCount=${peopleCount}`);
}

module.exports = { fuzz };
