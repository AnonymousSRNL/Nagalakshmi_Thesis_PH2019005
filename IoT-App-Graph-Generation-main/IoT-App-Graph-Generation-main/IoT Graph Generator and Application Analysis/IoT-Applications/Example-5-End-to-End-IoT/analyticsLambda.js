class AnalyticsLambda {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('lambda2', 'cold/clean');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'cold/clean') {
                const data = JSON.parse(message);

                Promise.resolve().then(() => {
                    const analyzed = this.analyze(data);
                    this.broker.publish('cold/analyzed', JSON.stringify(analyzed));
                });
            }
        });
    }

    analyze(data) {
        data.riskScore =
            (data.temperature > 10 ? 2 : 0) +
            (data.vibration > 5 ? 1 : 0) +
            (data.doorOpen ? 3 : 0);

        data.isCritical = data.riskScore >= 3;

        return data;
    }
}

module.exports = AnalyticsLambda;
