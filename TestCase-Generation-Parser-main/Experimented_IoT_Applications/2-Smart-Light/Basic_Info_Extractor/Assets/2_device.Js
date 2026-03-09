const deviceName = 'lightBulb';

const sensor = {
  publish: (topic, payload) => {}
};

sensor.publish("lightOnDurationTopic", JSON.stringify({
  lightOnDuration: 200
}));

