var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({ endpoint: 'a3jb9ni9xg51t6-ats.iot.us-east-1.amazonaws.com' });

exports.handler = async(event) => {
    console.log("Event => " + JSON.stringify(event));
   var break_status;
    if(event['breaking_event']>=4) 
        {
            break_status = "high";
            console.log("you have applied sudden break due to some circumstances and break_status is", break_status);
            if(event['engine_speed']>100)
                {
                    console.log(" but, sudden break at high speed may cause hit with preceding vehicle" );
                }
        }
    else
        {
            break_status="low";
            console.log("break_status is", break_status);
        }
}
