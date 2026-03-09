class HomeSafetyLambda {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'home/data') {
                const data = JSON.parse(message);

                // Async preprocessing
                Promise.resolve().then(() => {
                    const processed = this.preprocess(data);
                    this.broker.publish('home/processed', JSON.stringify(processed));
                });
            }
        });
    }

    preprocess(data) {
        data.temperature = (data.temperature - 32) * 5 / 9;
        data.humidity = data.humidity * 1.2;
        data.gasLeakage = data.gasLeakage ? 'Yes' : 'No';
        return data;
    }
}

module.exports = HomeSafetyLambda;
