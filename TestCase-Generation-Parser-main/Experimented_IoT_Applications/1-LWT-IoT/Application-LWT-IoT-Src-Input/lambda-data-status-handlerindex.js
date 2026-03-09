// lambda-data-status-handler/index.js
const AWS = require('aws-sdk');
const sns = new AWS.SNS();

// Replace with your SNS topic ARN
const USER_TOPIC_ARN = 'arn:aws:sns:ap-south-1:123456789012:UserNotificationTopic';

exports.handler = async (event) => {
  // If IoT Rule uses SELECT * FROM 'sensor/data' or 'sensor/status'
  // event will be the JSON payload from the device.

  console.log('[Lambda] Event:', JSON.stringify(event));

  // -----------------------------
  // SENSOR DATA HANDLING
  // -----------------------------
  if (event.temperature !== undefined && event.pressure !== undefined) {
    console.log(`[Lambda] Received data from sensor "${event.sensorId}":`, {
      timestamp: event.timestamp,
      temperature: event.temperature,
      pressure: event.pressure,
      classified: event.classified
    });

    // -----------------------------
    // SNS publish appended here
    // -----------------------------
    const message = {
      type: 'SENSOR_DATA',
      sensorId: event.sensorId,
      timestamp: event.timestamp,
      temperature: event.temperature,
      pressure: event.pressure,
      classified: event.classified
    };

    await sns.publish({
      TopicArn: USER_TOPIC_ARN,
      Message: JSON.stringify(message),
      Subject: `Sensor Data from ${event.sensorId}`
    }).promise();
  }

  // -----------------------------
  // SENSOR STATUS HANDLING
  // -----------------------------
  if (event.status !== undefined) {
    console.log(`[Lambda] Received status: Sensor "${event.sensorId}" is "${event.status}".`);

    // -----------------------------
    // SNS publish appended here
    // -----------------------------
    const message = {
      type: 'SENSOR_STATUS',
      sensorId: event.sensorId,
      status: event.status,
      timestamp: event.timestamp || new Date().toISOString()
    };

    await sns.publish({
      TopicArn: USER_TOPIC_ARN,
      Message: JSON.stringify(message),
      Subject: `Sensor Status: ${event.sensorId} is ${event.status}`
    }).promise();
  }

  return { statusCode: 200 };
};
