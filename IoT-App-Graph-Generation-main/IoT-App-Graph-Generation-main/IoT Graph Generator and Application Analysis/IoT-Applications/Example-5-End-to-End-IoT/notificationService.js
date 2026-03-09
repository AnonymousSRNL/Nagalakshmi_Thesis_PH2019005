class NotificationService {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('notify', 'cold/stored');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'cold/stored') {
                const data = JSON.parse(message);

                if (data.isCritical) {
                    console.log(`[Notification] CRITICAL ALERT for ${data.sensorId}`);
                    console.log(`  Temperature: ${data.temperature}°C`);
                    console.log(`  Vibration: ${data.vibration}`);
                    console.log(`  Door Open: ${data.doorOpen}`);
                    console.log(`  Risk Score: ${data.riskScore}`);
                } else {
                    console.log(`[Notification] Normal update stored for ${data.sensorId}`);
                }
            }
        });
    }
}

module.exports = NotificationService;
