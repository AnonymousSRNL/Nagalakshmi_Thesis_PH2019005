class HomeSafetyStorage {
    constructor(broker) {
        this.broker = broker;
        this.db = [];
    }

    start() {
        this.broker.subscribe('storage', 'home/processed');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'home/processed') {
                const data = JSON.parse(message);

                if (data.temperature < 30 && data.humidity < 80) {
                    // Async simulated DB write
                    setTimeout(() => {
                        this.db.push(data);
                        console.log('[Storage] Saved:', data);
                    }, 10);
                } else {
                    console.log('[Storage] Skipped (threshold exceeded):', data);
                }
            }
        });
    }
}

module.exports = HomeSafetyStorage;
