class MoistureLambda {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('lambda1', 'soil/data');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'soil/data') {
                const data = JSON.parse(message);

                // Async processing
                Promise.resolve().then(() => {
                    const processed = this.process(data);
                    this.broker.publish('soil/processed', JSON.stringify(processed));
                });
            }
        });
    }

    process(data) {
        console.log(`[Lambda1] Moisture: ${data.moisture}% from ${data.sensorId}`);
        data.isDry = data.moisture < 30;
        return data;
    }
}

module.exports = MoistureLambda;
