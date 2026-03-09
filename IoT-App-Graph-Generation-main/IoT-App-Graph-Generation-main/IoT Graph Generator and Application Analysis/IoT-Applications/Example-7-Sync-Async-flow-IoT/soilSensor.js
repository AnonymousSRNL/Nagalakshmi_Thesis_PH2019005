class SoilSensor {
    constructor(sensorId, broker) {
        this.sensorId = sensorId;
        this.broker = broker;
        this.interval = null;
    }

    generateData() {
        return {
            moisture: Math.floor(Math.random() * 100),   // 0–99%
            phLevel: (Math.random() * 3 + 5).toFixed(2)  // pH 5.00–8.00
        };
    }

    connect() {
        this.broker.connect(this.sensorId, {
            LWT: {
                topic: 'soil/status',
                message: JSON.stringify({ sensorId: this.sensorId, status: 'dead' })
            }
        });

        this.publishData();

        //this.interval = setInterval(() => {
            //this.publishData();
        //}, 3000);
    }

    publishData() {
        const data = this.generateData();
        const payload = { sensorId: this.sensorId, ...data };
        this.broker.publish('soil/data', JSON.stringify(payload));
    }

    stop() {
        clearInterval(this.interval);
        this.broker.publish('soil/status', JSON.stringify({ sensorId: this.sensorId, status: 'dead' }));
        this.broker.disconnect(this.sensorId);
    }
}

module.exports = SoilSensor;
