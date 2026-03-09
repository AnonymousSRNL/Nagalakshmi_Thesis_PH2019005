// Simulated pressure reading for this example
const simulatedPressure = 15; // Example value, replace with actual reading

// AWS IoT Configuration (similar to above)

// MQTT Topic
const pressureTopic = 'pressure/topic';

// Publish Pressure Reading
iot.on('connect', () => {
  setInterval(() => {
    const pressureReading = {
      pressure: simulatedPressure,
    };
    iot.publish(pressureTopic, JSON.stringify(pressureReading));
  }, 5000); // Publish every 5 seconds
});
