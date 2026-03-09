class CollisionAvoidanceApp {
    constructor(broker) {
        this.broker = broker;
    }

    start() {
        this.broker.subscribe('collision', 'vehicle/raw');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'vehicle/raw') {
                const data = JSON.parse(message);

                if (data.rearDistance < 5) {
                    console.log(`[CollisionAvoidance] Rear vehicle too close! Requesting DO NOT STOP.`);
                    this.broker.publish('vehicle/command', JSON.stringify({
                        source: 'CollisionAvoidanceApp',
                        action: 'DO_NOT_STOP',
                        reason: 'Rear vehicle too close'
                    }));
                }
            }
        });
    }
}

module.exports = CollisionAvoidanceApp;
