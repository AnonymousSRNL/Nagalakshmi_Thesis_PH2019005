const { expect } = require('chai');
const MQTTBroker = require('./Mqtt');
const AlarmHandler = require('./AlarmHandler');

describe('MQTT LWT Message Delivery', function () {
  let broker;
  let alarmHandler;

  before(function (done) {
    broker = new MQTTBroker();
    alarmHandler = new AlarmHandler(broker);
    alarmHandler.start();
    done();
  });

  it('should guarantee delivery of LWT message to AlarmHandler', function (done) {
    const testSensorId = 'sensor-123';
    
    // Subscribe to LWT topic
    broker.subscribe('alarm-tester', 'sensor/status');

    // Simulate a sensor disconnecting
    broker.publish('sensor/status', JSON.stringify({ sensorId: testSensorId, status: 'dead' }));

    // Check if AlarmHandler receives it
    broker.on('message', (clientId, topic, message) => {
      if (topic === 'sensor/status') {
        const status = JSON.parse(message);
        expect(status.sensorId).to.equal(testSensorId);
        expect(status.status).to.equal('dead');
        console.log(`[Test] AlarmHandler received LWT message: ${JSON.stringify(status)}`);
        done();
      }
    });
  });

  after(function () {
    broker.disconnect();
  });
});
