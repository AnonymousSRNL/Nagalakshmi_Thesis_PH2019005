Sensor publishing temarature data with attributes A1,A2 to IoT core on "temperature-topic".

const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
    keyPath: 'path/to/your/private-key.pem',
    certPath: 'path/to/your/certificate.pem.crt',
    caPath: 'path/to/your/root-CA.crt',
    clientId: 'your-client-id',
    host: 'your-iot-endpoint.iot.us-east-1.amazonaws.com'
});

device.on('connect', function () {
    console.log('Connected to AWS IoT Core');
    const data = {
        A1: Math.random() * 100,
        A2: Math.random() * 100,
        deviceId: 'sensor-001'
    };
    device.publish('temperature-topic', JSON.stringify(data));
});
