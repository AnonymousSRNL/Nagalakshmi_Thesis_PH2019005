var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({ endpoint: 'a3jb9ni9xg51t6-ats.iot.us-east-1.amazonaws.com' });
//var SNS=new aws.SNS();
exports.handler = async(event) => {
    console.log("Event => " + JSON.stringify(event));
    var break_status;
    if(event['oil_temp'] > 100) {
        if(event['car_status']==1)
        {
            var message="engine is heated much,  park the vehicle";
            console.log(message);
            break_status="high";
            console.log("break_status is", break_status);
        }
        else
        
        {
            console.log("car is parked");
            
        }
    }
        else
        {
            break_status="low";
            console.log("break_status is", break_status);
        }
        
}