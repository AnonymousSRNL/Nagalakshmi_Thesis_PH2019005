Oil-Temp-Lambda (Engine Overheat): Monitors the oil_temp attribute of the smart car.
If the oil_temp is above a certain threshold, the function sends a message to the driver urging them to park the vehicle immediately by applying break, 
due to engine overheat.

Acceleration_Lambda(Brake Warning): Monitors the brake_event and speed attributes of the smart car. 
If there's a significant braking event (brake_event >= 3) at high speed (speed > 100), 
the function sends a message to the driver warning them about the possibility of hitting the vehicle behind due to sudden braking.

When both Lambda functions work in parallel, there might be a situation where the contradictory messages are sent to the driver:

Example :

Oil-Temp-Lambda
Event => {"oil_temp": 120, "car_status": 1}

Acceleration_Lambda
Event => {"breaking_event": 5, "engine_speed": 120}

Contracdictory Messages to driver
1."Engine is heated much, park the vehicle, break_status is high"

2."you have applied sudden break due to some circumstances and break_status is high
 but, sudden break at high speed may cause hit with preceding vehicle"

Logs of the Lambda are exported and provided, which can be queried to fetch event params.

