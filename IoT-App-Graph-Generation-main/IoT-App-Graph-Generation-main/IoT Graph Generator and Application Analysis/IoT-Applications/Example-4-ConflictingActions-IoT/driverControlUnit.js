class DriverControlUnit {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('driver', 'vehicle/finalAction');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'vehicle/finalAction') {
                const { finalAction } = JSON.parse(message);

                if (finalAction === 'STOP') {
                    console.log(`[DriverControl] Vehicle stopping safely.`);
                } else {
                    console.log(`[DriverControl] Maintaining speed to avoid collision.`);
                }
            }
        });
    }
}

module.exports = DriverControlUnit;
