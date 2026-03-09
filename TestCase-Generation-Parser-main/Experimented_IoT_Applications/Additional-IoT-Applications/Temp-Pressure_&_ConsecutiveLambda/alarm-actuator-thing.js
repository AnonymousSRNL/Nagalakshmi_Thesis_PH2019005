const AWS = require('aws-sdk');

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_REGION'
});

// Create an IoT Data Plane instance
const iotdata = new AWS.IotData({ endpoint: 'YOUR_IOT_ENDPOINT' });

// Define the device and shadow name (using the same name)
const deviceName = 'alarm-actuator-thing';

// Define a function to get the shadow status
const getShadowStatus = () => {
  const params = {
    thingName: deviceName
  };

  iotdata.getThingShadow(params, (err, data) => {
    if (err) {
      console.error('Error getting shadow:', err);
    } else {
      const payload = JSON.parse(data.payload);
      const alarmSound = payload.state.desired['alarm sound'];
      console.log('Alarm Sound Status:', alarmSound);
    }
  });
};

// Call the function to get the shadow status
getShadowStatus();
