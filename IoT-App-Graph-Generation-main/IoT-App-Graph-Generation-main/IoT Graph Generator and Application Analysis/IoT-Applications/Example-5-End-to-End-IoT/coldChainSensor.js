class ColdChainSensor {
    constructor(sensorId, broker) {
        this.sensorId = sensorId;
        this.broker = broker;
        this.interval = null;
    }

    generateData() {
        return {
            temperature: Math.floor(Math.random() * 15) + 1,   // 1–15°C
            vibration: Math.floor(Math.random() * 10),         // 0–9
            doorOpen: Math.random() < 0.2                      // 20% chance
        };
    }

    connect() {
        this.broker.connect(this.sensorId, {
            LWT: {
                topic: 'cold/status',
                message: JSON.stringify({ sensorId: this.sensorId, status: 'dead' })
            }
        });

        this.publishData();

        //this.interval = setInterval(() => {
            //this.publishData();
        //}, 2500);
    }

    publishData() {
        const data = this.generateData();
        const payload = { sensorId: this.sensorId, ...data };
        this.broker.publish('cold/raw', JSON.stringify(payload));
    }

    stop() {
        clearInterval(this.interval);
        this.broker.publish('cold/status', JSON.stringify({ sensorId: this.sensorId, status: 'dead' }));
        this.broker.disconnect(this.sensorId);
    }
}

module.exports = ColdChainSensor;
