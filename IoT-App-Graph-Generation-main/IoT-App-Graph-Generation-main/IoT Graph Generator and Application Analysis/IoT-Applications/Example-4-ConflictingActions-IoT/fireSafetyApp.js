class FireSafetyApp {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('fire', 'vehicle/raw');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'vehicle/raw') {
                const data = JSON.parse(message);

                if (data.engineTemp > 180) {
                    console.log(`[FireSafety] Engine overheating! Requesting STOP.`);
                    this.broker.publish('vehicle/command', JSON.stringify({
                        source: 'FireSafetyApp',
                        action: 'STOP',
                        reason: 'Engine overheating'
                    }));
                }
            }
        });
    }
}

module.exports = FireSafetyApp;
