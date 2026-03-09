const MQTTBroker = require('./Mqtt');
const TemperatureSensor = require('./temperatureSensor');
const TemperatureLambda = require('./temperatureLambda');
const TemperatureStorage = require('./temperatureStorage');
const TemperatureAlarm = require('./temperatureAlarm');

const broker = new MQTTBroker();

const sensor = new TemperatureSensor('temp-sensor-001', broker);

const lambda = new TemperatureLambda(broker);
lambda.start();

const storage = new TemperatureStorage(broker);
storage.start();

const alarm = new TemperatureAlarm(broker);
alarm.start();

sensor.connect();

console.log('\n=== Broker State ===');
broker.listClients();
broker.listSubscriptions();
broker.listRetainedMessages();
console.log('=====================\n');

setTimeout(() => {
    sensor.stop();
}, 12000);
