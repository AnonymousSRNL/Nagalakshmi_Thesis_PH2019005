class TemperatureAlarm {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('alarm', 'temp/processed');
        this.broker.subscribe('alarm', 'temp/status');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'temp/processed') {
                const data = JSON.parse(message);
                if (data.isHigh) {
                    console.log(`[Alarm] ALERT! High temperature detected: ${data.temperature}`);
                }
            }

            if (topic === 'temp/status') {
                const status = JSON.parse(message);
                if (status.status === 'dead') {
                    console.log(`[Alarm] Sensor "${status.sensorId}" is offline.`);
                }
            }
        });
    }
}

module.exports = TemperatureAlarm;
