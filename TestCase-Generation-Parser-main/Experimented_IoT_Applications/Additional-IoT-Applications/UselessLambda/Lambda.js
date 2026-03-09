exports.handler = async (event) => {
    const message = JSON.parse(event.payload);
    
    // Process the message data here
    console.log('Received message:', message);
    
    return {
        statusCode: 200,
        body: JSON.stringify('Message processed successfully'),
    };
};
