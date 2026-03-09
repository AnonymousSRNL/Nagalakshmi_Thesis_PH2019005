// sensor-aws.js
const awsIot = require('aws-iot-device-sdk');

const deviceName = 'sensor-001';   // <-- your line kept and valid

class SensorDevice {
  constructor(sensorId, config) {
    this.sensorId = sensorId;
    this.device = awsIot.device({
      clientId: sensorId,
      //host: config.host,
      //keyPath: config.keyPath,
      /certPath: config.certPath,
      //caPath: config.caPath,
      protocol: 'mqtts',
      will: {
        topic: 'sensor/status',
        payload: JSON.stringify({ sensorId: this.sensorId, status: 'dead' }),
        qos: 1,
        retain: false
      }
    });
  }

  start() {
    this.device.on('connect', () => {
      console.log(`[Sensor] Connected as "${this.sensorId}"`);
      this.startPublishing();
    });

    this.device.on('error', (err) => {
      console.error('[Sensor] Error:', err);
    });
  }

  startPublishing() {
    const data = {
      sensorId: this.sensorId,
      timestamp: new Date().toISOString(),
      temperature: (Math.random() * 20 + 30).toFixed(2),
      pressure: (Math.random() * 10 + 100).toFixed(2),
      classified: true,
    };


    this.device.publish("sensor/data", JSON.stringify(data));
    this.device.publish("sensor/status", JSON.stringify({
      sensorId: this.sensorId,
      status: "alive"
    }));
   
    console.log('[Sensor] Published data:', data);
  }

  stop() {
    console.log(`[Sensor] Sensor "${this.sensorId}" stopped.`);
    this.device.publish('sensor/status', JSON.stringify({
      sensorId: this.sensorId,
      status: 'dead'
    }));
    this.device.end();
  }
}

// Example usage
const sensor = new SensorDevice('sensor-001', {
  host: '<your-iot-endpoint>',
  keyPath: './certs/private.key',
  certPath: './certs/certificate.pem.crt',
  caPath: './certs/AmazonRootCA1.pem'
});

sensor.start();

setTimeout(() => sensor.stop(), 10000);

module.exports = SensorDevice;
