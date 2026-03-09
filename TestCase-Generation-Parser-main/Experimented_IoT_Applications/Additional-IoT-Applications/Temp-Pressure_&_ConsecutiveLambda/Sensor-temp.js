// Simulated temperature reading for this example
const simulatedTemperature = 190; // Example value, replace with actual reading

// AWS IoT Configuration
const awsIot = require('aws-iot-device-sdk');
const iot = awsIot.device({
  keyPath: 'path_to_private_key.pem',
  certPath: 'path_to_certificate.pem',
  caPath: 'path_to_root_ca.pem',
  clientId: 'temperature-sensor',
  host: 'your_iot_endpoint',
});

// MQTT Topic
const temperatureTopic = 'temperature/topic';

// Publish Temperature Reading
iot.on('connect', () => {
  setInterval(() => {
    const temperatureReading = {
      temperature: simulatedTemperature,
    };
    iot.publish(temperatureTopic, JSON.stringify(temperatureReading));
  }, 5000); // Publish every 5 seconds
});
