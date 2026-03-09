In this scenario, one app triggers an event by changing a device attribute, 
which in turn triggers an event subscribed to by another app. 

For example, the first Lambda sends 'Switch off boiler due to high temperature and pressure.'message,
when high pressure and high temparature is detected and calls Lambda2 to start alarm. 

The second lambda writes { state: { desired: { 'alarm sound': 'on' } } }
to alarm actuator shadow ('alarm-actuator-thing') to switch on alarm sound.

But one app(Lambda3) subscribed to 'alarm-actuator-thing', might lock a door when the 'alarm sound' is turned on.

Our event coverage identifies such chaining. 
By Analyzing \textit{EventCoverageTable}, 
It is seen that EC can act as EG for the next EC and that EC again acts as EG for subsequent EC forming a chain, 
Proper merging of tuples of EventCoverageTable on the common event, 
forms a chain from the initial event generator(sensor/source component)-$EG_1$ to the final event consumer.
$EG_1$-->$EC_1$($EG_2$)-->$EC_2$($EG_3$)-->...$EC_n$ . 
Such test cases reveal the unintended behavior caused by the chaining of event actions. 
