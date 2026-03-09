const MQTTBroker = require('./Mqtt');
const HomeSafetySensor = require('./homeSafetySensor');
const HomeSafetyLambda = require('./homeSafetyLambda');
const HomeSafetyStorage = require('./homeSafetyStorage');
const HomeSafetyAlarm = require('./homeSafetyAlarm');

const broker = new MQTTBroker();

const sensor = new HomeSafetySensor('home-sensor-001', broker);

const lambda = new HomeSafetyLambda(broker);
lambda.start();

const storage = new HomeSafetyStorage(broker);
storage.start();

const alarm = new HomeSafetyAlarm(broker);
alarm.start();

sensor.connect();

console.log('\n=== Broker State ===');
broker.listClients();
broker.listSubscriptions();
broker.listRetainedMessages();
console.log('=====================\n');

setTimeout(() => {
    sensor.stop();
}, 8000);
