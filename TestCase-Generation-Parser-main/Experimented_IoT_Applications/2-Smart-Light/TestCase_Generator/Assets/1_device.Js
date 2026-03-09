const deviceName = 'LightSensor';

const sensor = {
  publish: (topic, payload) => {}
};

sensor.publish("lightSensorTopic", JSON.stringify({
  uv_visible: 742.44
}));
