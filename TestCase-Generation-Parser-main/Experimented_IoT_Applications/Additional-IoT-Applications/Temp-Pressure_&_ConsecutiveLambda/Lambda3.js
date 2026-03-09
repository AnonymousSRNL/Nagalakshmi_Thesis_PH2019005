const AWS = require('aws-sdk');
AWS.config.update({ region: 'your_region' });
const iotData = new AWS.IotData({ endpoint: 'your_iot_data_endpoint' });

exports.handler = async (event) => {
  try {
    const response = await iotData.getThingShadow({
      thingName: 'alarm-actuator-thing', // Name of the alarm sound actuator
    }).promise();
    
    const payload = JSON.parse(response.payload);
    const alarmSound = payload.state.desired['alarm sound'] || 'off';
    
    if (alarmSound === 'on') {
      // Lock the house doors (replace with your actual door locking logic)
      // ...
      
      // Update actuator device's shadow (write to shadow)
      await updateActuatorShadow('lock-doors', 'locked');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

async function updateActuatorShadow(detailType, status) {
  const payload = {
    state: {
      desired: {
        detailType,
        status,
      },
    },
  };

  try {
    await iotData.updateThingShadow({
      thingName: 'actuator-device', // Name of the actuator device
      payload: JSON.stringify(payload),
    }).promise();
  } catch (error) {
    console.error('Error updating actuator shadow:', error);
  }
}


In this example, the Lambda 3 code retrieves the desired state from the actuator device's shadow and checks if the alarm sound is set to 'on'. 
If it is, the Lambda triggers the door locking logic (replace with your actual logic) and 
then updates the actuator device's shadow to indicate that the doors have been locked.