// lambdaVitals.js
exports.handler = async (event, mqttClient) => {
  const heartRate = event?.state?.reported?.heartRate;

  if (!heartRate) return;

  if (heartRate < 60 || heartRate > 100) {
    const msg = `⚠ ALERT: Abnormal heart rate detected in Room 101: ${heartRate} bpm`;
    console.log(msg);
    mqttClient.publish("alerts/medical/heartRate", msg);
  }

  // ---- SEND COVERAGE BACK ----
  if (global.__coverage__) {
    mqttClient.publish(
      "coverage/vitals",
      JSON.stringify({ testCaseId: event.testCaseId, coverage: global.__coverage__ })
    );
  }
};
