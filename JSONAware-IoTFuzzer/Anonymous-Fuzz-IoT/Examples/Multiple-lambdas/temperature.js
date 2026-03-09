const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Temperature client connected');
    client.subscribe('sensor/temperature');
});

client.on('message', (topic, message) => {
    if (topic !== 'sensor/temperature') return;

    try {
        const parsed = JSON.parse(message.toString());
        console.log('Temperature received:', parsed);

        const temp = parseFloat(parsed.value);
        const testCaseId = parsed.testCaseId;
        
        if (temp > 30) {
            const acCommand = {
                action: 'TURN_ON',
                reason: `High temperature: ${temp}°C`,
                testCaseId
            };
            client.publish('control/ac', JSON.stringify(acCommand));
            console.log(' Sent AC ON command');
        } else if (temp < 24) {
            const acCommand = {
                action: 'TURN_OFF',
                reason: `Temperature normalized: ${temp}°C`,
                testCaseId
            };
            client.publish('control/ac', JSON.stringify(acCommand));
            console.log(' Sent AC OFF command');
        }

    } catch(e) {
        console.log('Non-JSON temperature message:', message.toString());
    }
});

client.on('error', (err) => {
    console.error('Temperature client error:', err.message);
});
