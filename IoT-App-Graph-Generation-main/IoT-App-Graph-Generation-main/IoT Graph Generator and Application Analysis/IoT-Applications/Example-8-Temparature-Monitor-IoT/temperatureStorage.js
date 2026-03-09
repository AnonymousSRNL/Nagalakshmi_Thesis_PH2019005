class TemperatureStorage {
    constructor(broker) {
        this.broker = broker;
        this.db = [];
    }

    start() {
        this.broker.subscribe('storage', 'temp/processed');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'temp/processed') {
                const data = JSON.parse(message);

                // Only store if temperature is safe
                if (data.temperature <= 80) {
                    setTimeout(() => {
                        this.db.push(data);
                        console.log('[Storage] Saved:', data);
                    }, 20);
                } else {
                    console.log('[Storage] Skipped (too hot):', data);
                }
            }
        });
    }
}

module.exports = TemperatureStorage;
