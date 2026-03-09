class TemperatureLambda {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'temp/data') {
                const data = JSON.parse(message);

                // Async processing
                Promise.resolve().then(() => {
                    const processed = this.process(data);
                    this.broker.publish('temp/processed', JSON.stringify(processed));
                });
            }
        });
    }

    process(data) {
        // Add a derived field
        data.isHigh = data.temperature > 30;
        return data;
    }
}

module.exports = TemperatureLambda;
