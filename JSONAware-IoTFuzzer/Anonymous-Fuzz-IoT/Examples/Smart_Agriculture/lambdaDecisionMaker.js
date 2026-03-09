exports.handler = async (event) => {
  const sensorData = event.state.reported;

  console.log("Lambda received:", sensorData);

  // Decision logic
  if (sensorData.soilMoisture < 30 && sensorData.cropHealth === "Good") {
    console.log("Initiating irrigation in Field A.");
  } 
  else if (sensorData.temperature > 35 && sensorData.humidity < 40) {
    console.log("Conditions indicate possible dehydration for crops.");
  }
  else if (sensorData.cropHealth === "Poor") {
    console.log("Recommend plant disease inspection in Field A.");
  } 
  else {
    console.log("Conditions normal, no action required.");
  }

  // Shadow update simulation
  console.log("Updating desired irrigation/harvest state.");

  return {
    result: "Processed",
    desired: {
      irrigation: sensorData.soilMoisture < 30,
      harvest: sensorData.temperature < 28 && sensorData.cropHealth === "Good"
    }
  };
};
