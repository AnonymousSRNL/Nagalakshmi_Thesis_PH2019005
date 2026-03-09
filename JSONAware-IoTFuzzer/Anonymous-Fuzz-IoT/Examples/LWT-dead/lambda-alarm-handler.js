// lambda-alarm-handler.js
module.exports = async function handleAlarm(event) {
  console.log('[lambda-alarm-handler] Event:', event);

  if (event.status === 'offline' || event.status === 'dead') {
    console.log('[lambda-alarm-handler] Raising alarm for device:', event.sensorId);
  }

  if (event.temperature != null && event.temperature > 70) {
    console.log('[lambda-alarm-handler] Critical overheat alarm');
  }
};
