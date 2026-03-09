const AWS = require('aws-sdk');
AWS.config.update({ region: 'your_region' });
const lambda = new AWS.Lambda();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const temperature = event.temperature;
  const pressure = event.pressure;

  if (temperature > 180 && pressure > 10) {
    try {
      // Invoke Lambda 2
      await lambda.invoke({
        FunctionName: 'lambda2-function-name', // Name of Lambda 2 function
        InvocationType: 'Event',
        Payload: JSON.stringify({ temperature, pressure }),
      }).promise();

      // Publish SNS
      await sns.publish({
        Message: 'Switch off boiler due to high temperature and pressure.',
        TopicArn: 'arn:aws:sns:your_region:your_account_id:boiler-topic',
      }).promise();

      // Update pressure valve actuator shadow
      const iotData = new AWS.IotData({ endpoint: 'your_iot_data_endpoint' });
      const payload = { state: { desired: { valve: 'OPEN' } } };
      await iotData.updateThingShadow({
        thingName: 'pressure-valve-thing',
        payload: JSON.stringify(payload),
      }).promise();
    } catch (error) {
      console.error('Error:', error);
    }
  }
};
