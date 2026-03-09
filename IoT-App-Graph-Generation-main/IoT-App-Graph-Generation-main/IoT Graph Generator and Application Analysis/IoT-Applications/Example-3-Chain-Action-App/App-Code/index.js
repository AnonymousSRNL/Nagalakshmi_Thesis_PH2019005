// index.js - Main application
const { sensor1, sensor2 } = require('./sensor');
const mqtt = require('./mqtt');
const RuleEngine = require('./ruleEngine');

sensor1.on('data', (data) => {
    mqtt.publish('temperature', data);
});

sensor2.on('data', (data) => {
    mqtt.publish('acSensor', data);
});

mqtt.on('temperature', (data) => {
    RuleEngine.rule1(data);
});

mqtt.on('acStatus', (status) => {
    mqtt.publish('acSensor', status); // Simulating consequence execution
});

mqtt.on('acSensor', (data) => {
    RuleEngine.rule2(data);
});

sensor1.start();
sensor2.start();