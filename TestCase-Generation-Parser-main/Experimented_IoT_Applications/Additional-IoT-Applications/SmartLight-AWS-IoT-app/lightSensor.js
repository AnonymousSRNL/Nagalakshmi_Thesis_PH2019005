/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

//* CONFIGURE and DEFINE

var awsIot = require('aws-iot-device-sdk');

// Load the endpoint from file
const endpointFile = require('/home/ec2-user/environment/endpoint.json');

// Fetch the deviceName from the folder name
const deviceName = 'lightSensor';

// AWS IoT DEVICE
const device = awsIot.device({
   keyPath: 'sensor-private.pem.key',
  certPath: 'sensor-certificate.pem.crt',
    caPath: '/home/ec2-user/environment/root-CA.crt',
  clientId: deviceName,
      host: endpointFile.endpointAddress
});

const topic_name = 'lightSensorTopic'

// Connect to AWS IT and publish a test output "testData: 1" to the SNS topic
device
  .on('connect', function() {
    console.log('connect');
    device.subscribe(topic_name);
    device.publish(topic_name, JSON.stringify({ testData: 1 }));
    });

// CALL THE PERIODIC ACTIVITY FUNCTION
periodicActivity(); 

// * Periodic Activity Function - Runs in a loop with wait in between

function periodicActivity() 
{  
    
    // get the light sensor reading  
    // var uv_visible = uv.readWord(0x22); // lux
    var uv_visible = Math.random() * 1000; // lux

  
    //*** This section is for debugging with XDK console output ***//
    /*    
        // get the current date in ISO format
    var date = new Date;
    var time_now = date.toISOString();
        
        var json = {
            device_id: deviceId,
            time: time_now,
            uv_visible: uv_visible // lux
        };
        
    var payload = JSON.stringify(json);    
    console.log(payload);
    */
    

    // Publish the light sensor reading to the AWS SNS topic
    device.publish(topic_name, JSON.stringify({uv_visible: uv_visible}));
     
    console.log(uv_visible);
    setTimeout(periodicActivity,10000); // run periodicActivity again in 10 seconds
    
}