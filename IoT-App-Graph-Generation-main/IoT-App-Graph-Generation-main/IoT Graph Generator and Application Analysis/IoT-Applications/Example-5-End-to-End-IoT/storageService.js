class StorageService {
    constructor(broker) {
        this.broker = broker;
        this.db = [];
    }

    start() {
        this.broker.subscribe('storage', 'cold/analyzed');

        this.broker.on('message', (clientId, topic, message) => {
            if (topic === 'cold/analyzed') {
                const data = JSON.parse(message);

                setTimeout(() => {
                    this.db.push(data);
                    this.broker.publish('cold/stored', JSON.stringify(data));
                }, 20);
            }
        });
    }
}

module.exports = StorageService;
