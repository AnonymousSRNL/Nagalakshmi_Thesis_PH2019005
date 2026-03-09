class CommandResolver {
    constructor(broker) {
        this.broker = broker;
        this.pending = [];
    }

    start() {
        this.broker.subscribe('resolver', 'vehicle/command');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'vehicle/command') {
                const cmd = JSON.parse(message);
                this.pending.push(cmd);

                // Async resolution to simulate processing delay
                setTimeout(() => this.resolve(), 50);
            }
        });
    }

    resolve() {
        if (this.pending.length === 0) return;

        const fireCmd = this.pending.find(c => c.action === 'STOP');
        const collisionCmd = this.pending.find(c => c.action === 'DO_NOT_STOP');

        let finalAction;

        if (fireCmd && collisionCmd) {
            console.log(`[Resolver] Conflict detected between apps.`);
            // Priority rule: collision avoidance wins (safety of passengers)
            finalAction = 'DO_NOT_STOP';
        } else if (fireCmd) {
            finalAction = 'STOP';
        } else if (collisionCmd) {
            finalAction = 'DO_NOT_STOP';
        }

        this.pending = [];

        this.broker.publish('vehicle/finalAction', JSON.stringify({ finalAction }));
    }
}

module.exports = CommandResolver;
