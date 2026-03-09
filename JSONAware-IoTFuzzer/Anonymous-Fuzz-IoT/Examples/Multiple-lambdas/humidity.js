const mqtt = require('mqtt');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://iot-db:adithya123@fuzzcluster.vftfa3r.mongodb.net/iot-db?retryWrites=true&w=majority&appName=FuzzCluster')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

const sensorLogSchema = new mongoose.Schema({
  source: String,
  value: Number,
  unit: String,
  testCaseId: Number,
  type: String,
  timestamp: { type: Date, default: Date.now }
});

const SensorLog = mongoose.model('SensorLog', sensorLogSchema);

module.exports = { SensorLog };

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Humidity client connected');
    client.subscribe('sensor/humidity');
});

client.on('message', async (topic, message) => {
    if (topic !== 'sensor/humidity') return;

    try {
        const parsed = JSON.parse(message.toString());
        console.log('Humidity received:', parsed);

        const humidity = parseFloat(parsed.value);
        const testCaseId = parsed.testCaseId;

        if (humidity > 70) {
            const log = new SensorLog({
                source: 'humidity',
                value: humidity,
                unit: '%',
                testCaseId,
                type: 'High Humidity'
            });

            await log.save();
            console.log('Logged high humidity to MongoDB Atlas');
        }

    } catch(e) {
        console.log('Non-JSON humidity message');
    }
});
