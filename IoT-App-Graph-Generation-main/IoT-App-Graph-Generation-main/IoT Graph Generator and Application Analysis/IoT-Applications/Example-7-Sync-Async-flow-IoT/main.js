const MQTTBroker = require('./Mqtt');
const SoilSensor = require('./soilSensor');
const MoistureLambda = require('./moistureLambda');
const AlertLambda = require('./alertLambda');

const broker = new MQTTBroker();

const sensor = new SoilSensor('soil-sensor-001', broker);

const lambda1 = new MoistureLambda(broker);
lambda1.start();

const lambda2 = new AlertLambda(broker);
lambda2.start();

sensor.connect();

setTimeout(() => {
    sensor.stop();
}, 10000);
