const EventEmitter = require('events');
class MQTTHandler extends EventEmitter {
    publish(topic, data) {
        console.log(`MQTT Published on ${topic}: ${data}`);
        this.emit(topic, data);
    }
}
module.exports = new MQTTHandler();