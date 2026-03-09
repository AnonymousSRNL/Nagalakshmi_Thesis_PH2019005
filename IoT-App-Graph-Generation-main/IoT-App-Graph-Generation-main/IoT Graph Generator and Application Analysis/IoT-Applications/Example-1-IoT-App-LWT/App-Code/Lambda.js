class LambdaHandler {
  constructor(broker) {
    this.broker = broker;
  }

  start() {
    this.broker.on('message', (clientId, topic, message) => {
      if (topic === 'sensor/data') {
        const data = JSON.parse(message);
        console.log(`[Lambda] Received data from sensor "${data.sensorId}":`, data);
        // Add processing logic for sensor data here
      }

      if (topic === 'sensor/status') {
        const status = JSON.parse(message);
        console.log(`[Lambda] Received LWT message: Sensor "${status.sensorId}" is "${status.status}".`);
      }
    });
  }
}

module.exports = LambdaHandler;