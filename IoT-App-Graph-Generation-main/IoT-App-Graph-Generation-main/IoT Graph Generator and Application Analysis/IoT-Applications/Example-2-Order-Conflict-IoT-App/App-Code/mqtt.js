// mqtt.js - MQTT module for publishing and subscribing
const EventEmitter = require('events');
class MQTTHandler extends EventEmitter {
    publish(data) {
        console.log(`MQTT Published: ${data}`);
        this.emit('message', data);
    }
}
module.exports = new MQTTHandler();

