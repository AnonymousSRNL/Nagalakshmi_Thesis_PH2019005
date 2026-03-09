const mqtt = require('mqtt');
const mongoose = require('mongoose');
const axios = require('axios');

const client = mqtt.connect('mqtt://localhost:1883');

mongoose.connect('mongodb+srv://iot-db:adithya123@fuzzcluster.vftfa3r.mongodb.net/iot-db?retryWrites=true&w=majority&appName=FuzzCluster')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const acSchema = new mongoose.Schema({
    value: String, // ON / OFF
    testCaseId: Number,
    timestamp: { type: Date, default: Date.now }
});
const ACState = mongoose.model('ACState', acSchema);

let acState = 'OFF';

client.on('connect', () => {
    console.log('AC controller connected');
    client.subscribe('control/ac');
});

client.on('message', async (topic, message) => {
    if (topic !== 'control/ac') return;

    try {
        const parsed = JSON.parse(message.toString());
        const { action, reason, testCaseId } = parsed;

        console.log(`Received AC command [testCaseId=${testCaseId}]: ${action} — ${reason}`);

        if (action === 'TURN_ON') 
            {
                if (acState === 'ON') {
                    console.log('AC is already ON. Ignoring.');
                } 
                else if(acState=='OFF') {
                    acState = 'ON';
                    console.log('AC TURNED ON');

                    // Insert document to DB (this will trigger )
                    await ACState.create({ value: 'ON', testCaseId });
                }
            } 
            else if (action === 'TURN_OFF') {
                if (acState === 'OFF') {
                    console.log('AC is already OFF. Ignoring.');
                } else {
                    acState = 'OFF';
                    console.log('AC TURNED OFF');
                }
            } 
            else {
                console.log('Unknown AC command:', action);
            }
    } catch (err) {
        console.error('Failed to parse AC message:', err.message);
    }
});

client.on('error', (err) => {
    console.error('AC client error:', err.message);
});
