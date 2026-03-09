const deviceName = 'device-19';

const sensor = {
  publish: (topic, payload) => {}
};

sensor.publish("sensor/data", JSON.stringify({
  sensorId: deviceName,
  timestamp: "2025-01-01T00:00:00Z",
  temperature: 41.2,
  pressure: 108.4
}));

sensor.publish("sensor/status", JSON.stringify({
  sensorId: deviceName,
  status: "dead",
  timestamp: "2025-01-01T00:00:10Z"
}));
