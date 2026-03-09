const MQTTBroker = require('./Mqtt');
const Sensor = require('./Sensor.1');
const LambdaHandler = require('./Lambda');
const AlarmHandler = require('./Alarm');

const broker = new MQTTBroker();

const sensor1 = new Sensor('sensor-001', broker);

const lambdaHandler = new LambdaHandler(broker);
lambdaHandler.start();

const alarmHandler = new AlarmHandler(broker);
alarmHandler.start();

sensor1.connect();

// setInterval(() => {
  console.log('\n=== Broker State ===');
  broker.listClients();
  broker.listSubscriptions();
  broker.listRetainedMessages();
  console.log('=====================\n');
// }, 5000);

setTimeout(() => {
  console.log('[Main] Stopping the sensor...');
  sensor1.stop();
}, 10000);

