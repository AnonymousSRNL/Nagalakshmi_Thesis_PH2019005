const EventEmitter = require('events');
class Sensor extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }
    
    start() {
        setInterval(() => {
            const value = Math.random() * 40 + 10; // Simulated sensor data (10-50°C or random AC readings)
            console.log(`${this.name} reading: ${value}`);
            this.emit('data', value);
        }, 2000);
    }
}
module.exports = { sensor1: new Sensor('Temperature Sensor'), sensor2: new Sensor('AC Sensor') };