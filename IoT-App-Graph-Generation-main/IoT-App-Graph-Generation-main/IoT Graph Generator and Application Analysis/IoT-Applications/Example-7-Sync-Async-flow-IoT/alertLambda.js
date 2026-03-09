class AlertLambda {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('lambda2', 'soil/processed');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'soil/processed') {
                const data = JSON.parse(message);

                this.process(data);
            }
        });
    }

    process(data) {
        console.log(`[Lambda2] pH Level: ${data.phLevel}`);

        if (data.isDry) {
            console.log(`[Lambda2] ALERT: Soil is too dry! Moisture=${data.moisture}%`);
        }

        if (data.phLevel < 5.5 || data.phLevel > 7.5) {
            console.log(`[Lambda2] ALERT: Abnormal pH detected: ${data.phLevel}`);
        }
    }
}

module.exports = AlertLambda;
