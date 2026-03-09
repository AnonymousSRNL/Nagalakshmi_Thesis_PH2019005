// acLambda.js - Lambda function triggered by AC status changes
async function acLambda(acStatus) {
    console.log('Lambda: Processing AC status change...');
    const windowStatus = acStatus === 'ON' ? 'CLOSED' : 'OPEN';
    console.log(`Lambda: Window Status: ${windowStatus}`);
    sns.sendNotification('WindowAlert', `AC is ${acStatus}, window set to ${windowStatus}`);
}
module.exports = acLambda;