const EventEmitter = require('events');
class Sensor extends EventEmitter {
    constructor() {
        super();
        this.threshold = 50; // Example threshold for fire detection
    }
    
    start() 
	{
            const temperature = Math.random() * 100; // Simulated sensor data
            console.log(`Sensor reading: ${temperature}`);
            this.emit('data', temperature);
          }
}
module.exports = new Sensor();