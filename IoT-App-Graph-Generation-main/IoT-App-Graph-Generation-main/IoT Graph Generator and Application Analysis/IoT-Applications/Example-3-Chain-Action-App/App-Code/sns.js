class SNS {
    static sendNotification(topic, message) {
        console.log(`SNS Notification sent on ${topic}: ${message}`);
    }
}
module.exports = SNS;