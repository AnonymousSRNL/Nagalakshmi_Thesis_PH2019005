// ruleEngine.js - Processing sensor data
const mqtt = require('./mqtt');

const { createBundle, uploadStr } = require('./lambda');
class RuleEngine {
    static handleFireDetection(data) {
        if (data > 50) {
            console.log('Fire detected! Processing handlers...');
            console.log('Invoking asynchronous handlers...');
            createBundle(data);
            uploadStr(data);
            console.log('Fire detection handlers invoked.');
        }
    }
}
module.exports = RuleEngine;