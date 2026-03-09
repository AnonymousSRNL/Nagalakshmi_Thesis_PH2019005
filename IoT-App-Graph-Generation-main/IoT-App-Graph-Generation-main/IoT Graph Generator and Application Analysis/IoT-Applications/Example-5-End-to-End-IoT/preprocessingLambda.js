class PreprocessingLambda {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('lambda1', 'cold/raw');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'cold/raw') {
                const data = JSON.parse(message);

                Promise.resolve().then(() => {
                    const processed = this.clean(data);
                    this.broker.publish('cold/clean', JSON.stringify(processed));
                });
            }
        });
    }

    clean(data) {
        data.temperature = Number(data.temperature);
        data.vibration = Number(data.vibration);
        return data;
    }
}

module.exports = PreprocessingLambda;
