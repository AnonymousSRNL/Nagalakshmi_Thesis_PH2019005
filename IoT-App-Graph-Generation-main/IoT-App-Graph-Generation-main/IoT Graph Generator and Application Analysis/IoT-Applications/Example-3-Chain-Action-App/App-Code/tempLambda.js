// tempLambda.js - Lambda function triggered by temperature changes
const mqtt = require('./mqtt');
const sns = require('./sns');
async function tempLambda(temp) {
    console.log('Lambda: Processing temperature data...');
    const acStatus = temp > 30 ? 'ON' : 'OFF';
    console.log(`Lambda: AC Status: ${acStatus}`);
    mqtt.publish('acStatus', acStatus);
    sns.sendNotification('TemperatureAlert', `Temperature reached ${temp}°C, AC turned ${acStatus}`);
}
module.exports = tempLambda;