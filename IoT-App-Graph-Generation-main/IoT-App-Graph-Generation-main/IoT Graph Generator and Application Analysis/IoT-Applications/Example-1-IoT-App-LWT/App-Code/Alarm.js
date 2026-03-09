class AlarmHandler {
  constructor(broker) {
    this.broker = broker;
  }

  start() {
    const clientId = 'alarm-handler'; 
    this.broker.subscribe(clientId, 'sensor/status');

    this.broker.on('message', (clientId, topic, message) => {
      if (topic === 'sensor/status') {
        const status = JSON.parse(message);
        console.log(`status ${status}`)
        if (status.status === 'dead') {
          console.log(`[Alarm] ALERT! Sensor "${status.sensorId}" is dead. Triggering alarm!`);
        }
      }
    });
  }
}

module.exports = AlarmHandler;