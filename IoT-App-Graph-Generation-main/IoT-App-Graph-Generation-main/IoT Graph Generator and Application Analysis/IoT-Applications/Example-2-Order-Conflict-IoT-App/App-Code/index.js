// index.js - Main application
const sensor = require('./sensor');
const mqtt = require('./mqtt');
const RuleEngine = require('./ruleEngine');
const { createBundle, uploadStr } = require('./lambda');

sensor.on('data', (data) => {
    mqtt.publish(data);
});

mqtt.on('message', (data) => {
    RuleEngine.handleFireDetection(data);
});

sensor.start();