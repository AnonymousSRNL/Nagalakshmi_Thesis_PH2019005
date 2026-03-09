class TemperatureSensor {
    constructor(sensorId, broker) {
        this.sensorId = sensorId;
        this.broker = broker;
        this.interval = null;
    }

    // Internal generator — no external file needed
    generateSensorData() {
        return {
            temperature: Math.floor(Math.random() * 100)
        };
    }

    connect() {
        this.broker.connect(this.sensorId, {
            LWT: {
                topic: 'temp/status',
                message: JSON.stringify({ sensorId: this.sensorId, status: 'dead' })
            }
        });

        // Sync publish on connect
        this.publishData();

        // Async periodic updates
        //this.interval = setInterval(() => {
            //this.publishData();
       // }, 3000);
    }

    publishData() {
        const data = this.generateSensorData();
        const payload = { sensorId: this.sensorId, ...data };
        this.broker.publish('temp/data', JSON.stringify(payload));
    }

    stop() {
        clearInterval(this.interval);
        console.log(`[Sensor] Sensor "${this.sensorId}" stopped.`);
        this.broker.publish('temp/status', JSON.stringify({ sensorId: this.sensorId, status: 'dead' }));
        this.broker.disconnect(this.sensorId);
    }
}

module.exports = TemperatureSensor;
