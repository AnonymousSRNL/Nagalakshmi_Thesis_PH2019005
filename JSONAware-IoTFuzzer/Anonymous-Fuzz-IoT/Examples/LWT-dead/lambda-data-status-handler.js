// lambda-data-status-handler.js
module.exports = async function handleDataStatus(event) {
  console.log('[lambda-data-status-handler] Event:', event);

  if (event.temperature != null && event.temperature > 50) {
    console.log('[lambda-data-status-handler] High temperature detected');
  }

  if (event.status === 'offline' || event.status === 'dead') {
    console.log('[lambda-data-status-handler] Device offline/dead');
  }
};
