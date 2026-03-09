function generateHomeSafetySystemData() {
    return {
        temperature: Math.floor(Math.random() * 100),
        humidity: Math.floor(Math.random() * 100),
        gasLeakage: Math.random() < 0.5,
        motionDetected: Math.random() < 0.5
    };
}

module.exports = generateHomeSafetySystemData;
