var awsIoT = require('aws-sdk');

awsIoT.config.region = "us-east-1";
var iotdata = new awsIoT.IotData({ endpoint: 'a3jb9ni9xg51t6-ats.iot.us-east-1.amazonaws.com' });

const thingName = 'lightBulb';
var params = {
  thingName: thingName,
};

exports.handler = async (event) => {
    console.log("hi1");
    // fetch lightBulb thing's shadow
    iotdata.getThingShadow(params, function(err, data) {
      if (err) {
          console.log(err, err.stack);
      }
      else {    
          console.log("hi2");
          console.log(data);  
          var dataObj = JSON.parse(data.payload);
          var time1 = new Date(); // current time
          var time2 = new Date(dataObj.state.reported.lightOffTimestamp); // latest time when lightBulb was in off state
          var diff = Math.abs(time1 - time2); // delta between times
          var diffMin = Math.ceil(diff / (60 * 1000)); // time difference in minutes
          console.log(diffMin);
          // if more than 3 hours over since lightBulb was off
          // send a message to lightOnDurationTopic 
          if(diffMin >= 3 * 60) {
              console.log("nice");
              var msg = {
                "lightOnDuration": diffMin
              }
              var params = {
                  topic: "lightOnDurationTopic",
                  payload: JSON.stringify(msg),
                  qos: 0
              };
          
              return iotdata.publish(params, function(err, data) {
                  if (err) {
                      console.log("ERROR => " + JSON.stringify(err));
                  }
                  else {
                      console.log("Success");
                  }
              }).promise();
          }
      }     
    });
};