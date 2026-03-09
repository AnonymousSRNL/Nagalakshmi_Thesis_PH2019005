// lambda-alarm-handler/index.js
const AWS = require('aws-sdk');

// Replace with your AWS IoT data endpoint (no protocol)
const IOT_ENDPOINT = 'xxxxxx-ats.iot.ap-south-1.amazonaws.com';

const iotData = new AWS.IotData({ endpoint: IOT_ENDPOINT });

exports.handler = async (event) => {
  console.log('[AlarmLambda] Event:', JSON.stringify(event));

  if (event.status === 'dead') {
    console.log(`[Alarm] ALERT! Sensor "${event.sensorId}" is dead. Updating shadow alarm state.`);

    const thingName = event.sensorId; // assuming thingName == sensorId
    const payload = {
      state: {
        desired: {
          alarm: 'ON'
        }
      }
    };

    await iotData.publish({
      topic: `$aws/things/${thingName}/shadow/update`,
      qos: 0,
      payload: JSON.stringify(payload)
    }).promise();
  }

  return { statusCode: 200 };
};
