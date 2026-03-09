class VehicleSensor {
    constructor(sensorId, broker) {
        this.sensorId = sensorId;
        this.broker = broker;
        this.interval = null;
    }

    generateData() {
        return {
            engineTemp: Math.floor(Math.random() * 200) + 50,   // 50–250°C
            rearDistance: Math.floor(Math.random() * 20) + 1    // 1–20 meters
        };
    }

    connect() {
        this.broker.connect(this.sensorId);

        this.publishData();

        //this.interval = setInterval(() => {
           // this.publishData();
        //}, 2000);
    }

    publishData() {
        const data = this.generateData();
        const payload = { sensorId: this.sensorId, ...data };
        this.broker.publish('vehicle/raw', JSON.stringify(payload));
    }

    stop() {
        clearInterval(this.interval);
        this.broker.disconnect(this.sensorId);
    }
}

module.exports = VehicleSensor;
