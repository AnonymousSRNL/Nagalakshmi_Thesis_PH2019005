const AWS = require('aws-sdk');
AWS.config.update({ region: 'your_region' });
const iotData = new AWS.IotData({ endpoint: 'your_iot_data_endpoint' });

exports.handler = async (event) => {
  const temperature = event.temperature;
  const pressure = event.pressure;

  if (temperature > 180 && pressure > 10) {
    try {
      // Update alarm sound actuator shadow
      const payload = { state: { desired: { 'alarm sound': 'on' } } };
      await iotData.updateThingShadow({
        thingName: 'alarm-actuator-thing', // Name of the alarm sound actuator
        payload: JSON.stringify(payload),
      }).promise();
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
 Lambda 2 can update the shadow of an alarm sound actuator based on the conditions you described,