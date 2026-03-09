const generateData = require('./homeSafetyDataGenerator');

class HomeSafetySensor {
    constructor(sensorId, broker) {
        this.sensorId = sensorId;
        this.broker = broker;
        this.interval = null;
    }

    connect() {
        this.broker.connect(this.sensorId, {
            LWT: {
                topic: 'home/status',
                message: JSON.stringify({ sensorId: this.sensorId, status: 'dead' })
            }
        });

        // Sync publish on connect
        this.publishData();

        // Async periodic updates
        //this.interval = setInterval(() => {
            //this.publishData();
        //}, 2000);

        // Async microtask event
        Promise.resolve().then(() => {
            this.simulateMotionEvent();
        });
    }

    publishData() {
        const data = generateData();
        const payload = { sensorId: this.sensorId, ...data };
        this.broker.publish('home/data', JSON.stringify(payload));
    }

    simulateMotionEvent() {
        const event = {
            sensorId: this.sensorId,
            motionDetected: Math.random() < 0.3
        };
        this.broker.publish('home/motion', JSON.stringify(event));
    }

    stop() {
        clearInterval(this.interval);
        console.log(`[Sensor] Sensor "${this.sensorId}" stopped.`);
        this.broker.publish('home/status', JSON.stringify({ sensorId: this.sensorId, status: 'dead' }));
        this.broker.disconnect(this.sensorId);
    }
}

module.exports = HomeSafetySensor;
