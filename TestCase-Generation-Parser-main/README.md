# TestCase-Generation-Parser

Introducing a JavaScript-based parser and test case generation framework designed for NodeJS-based IoT applications. This innovative solution automates test case creation, ensuring predetermined coverage goals are met. Boosting reliability and efficiency, the framework empowers IoT developers to deliver robust software, tailored to the demands of the IoT landscape.

## [1. SampleCodes_for_Parser](https://github.com/chakradhar06/TestCase-Generation-Parser/tree/main/TestCase_Generation_Parser/SampleCodes_for_Parser)
We've developed purposeful sample codes that mimic real-world scenarios. These codes strategically encompass a wide range of potential paths and routes, mirroring the complexity of actual projects. This approach empowers us to comprehensively evaluate our solution's performance by testing it across a spectrum of situations. Through these samples, we bridge theory and practice, ensuring our approach thrives in the face of real-world intricacies.

### [a. Descriptions](https://github.com/chakradhar06/TestCase-Generation-Parser/tree/main/TestCase_Generation_Parser/SampleCodes_for_Parser/Descriptions)
#### [i. TopicRule_Descriptions.json](https://github.com/chakradhar06/TestCase-Generation-Parser/blob/main/TestCase_Generation_Parser/SampleCodes_for_Parser/Descriptions/TopicRule_Descriptions.json) 
In our context, the rule description serves as a map of the data's journey, encompassing both its origin and its designated destinations. Specifically tailored to our setup, these rule descriptors outline the data's inception point, often originating from sensors. Additionally, they meticulously detail the specific routes through which the data must traverse, all the while encompassing crucial parameter information that accompanies it.

Yet, in the realm of lambda coverage and end-to-end coverage, our focus narrows to the intricate pathways the data undertakes. We prioritize the tracking of these destinations and sources to ensure comprehensive coverage. By meticulously maintaining this journey log, we effectively ensure that the data follows the intended paths, enhancing our understanding of the system's functionality and integrity. This meticulous approach guarantees that our coverage assessment accurately captures the entire spectrum of data movement and interaction.

#### [ii. EventSource_Mappings.json](https://github.com/chakradhar06/TestCase-Generation-Parser/blob/main/TestCase_Generation_Parser/SampleCodes_for_Parser/Descriptions/EventSource_Mappings.json)
The crux of our approach lies within the EventSource_Mappings. These mappings encapsulate the precise routes taken by a source, charting its trajectory towards a lambda function. Functioning as the point of origination for our code, these mappings allow us to define the inception of our journey. Contained within the EventSource_Mappings are vital elements: the function ARN and the event ARN. These components precisely identify the source and its designated destination. By diligently tracking these elements, we are equipped to unravel the routes that the data traverses.

This serves as the nucleus for both lambda coverage and end-to-end coverage criteria. Starting from a lambda function, we employ a reverse-engineering strategy, effectively retracing our steps through the pathways until we reach the initial sensor. By subsequently inverting this path, we attain a comprehensive test case that aptly fulfills both end-to-end and lambda coverage criteria.
In essence, our approach hinges on these EventSource_Mappings, which serve as the architectural backbone that enables us to meticulously dissect the data's journey, thereby achieving a robust and systematic assessment of both coverage dimensions.

#### [iii. EventBridgeRule_Descriptions.js](https://github.com/chakradhar06/TestCase-Generation-Parser/blob/main/TestCase_Generation_Parser/SampleCodes_for_Parser/Descriptions/EventBridgeRule_Descriptions.js)
The EventBridgeRule_Descriptions file encapsulates pathways that link AWS services together. Acting as the foundational step in the cloud journey, this file lays out the subsequent actions, serving as a guide for data movement. Meanwhile, the EventRule_Map and EventSource_Map play pivotal roles in charting the event's voyage, determining its trajectory, and leading it to the eventual destination—the actuator.

In essence, the EventBridgeRule_Descriptions file forms the bedrock, specifying initial cloud interactions. It's here that we define the first move. Then, the EventRule_Map and EventSource_Map meticulously shape the event's route, navigating it through AWS services, ultimately culminating in the interaction with the actuator. These files collectively orchestrate the intricate dance of data movement, ensuring seamless and orchestrated journeys from source to destination in the AWS environment.

### [b. LambdaFunctions](https://github.com/researcher06/TestCase-Generation-Parser/tree/main/TestCase_Generation_Parser/SampleCodes_for_Parser/LambdaFunctions)
Lambda functions play a key role in determining the destinations once a certain point is reached. These functions serve as the focal points for directing data flows. However, a challenge arises as these files lack internal cues to identify the originating lambda for each destination.

To address this, we've introduced a systematic approach. We've placed explicit comments within each file, facilitating tracking of the corresponding lambda function. By doing so, we establish a clear link between files and their originating lambdas. To ensure seamless execution of our code, please integrate these modifications into your lambda files. This strategic enhancement will enable us to accurately determine the source of destinations, thus optimizing the overall data flow within the system.

### [c. SensorDevices](https://github.com/researcher06/TestCase-Generation-Parser/tree/main/TestCase_Generation_Parser/SampleCodes_for_Parser/SensorDevices)
The sensor files stand as representations of actual sensor data, serving as the content published to the cloud. In our setup, we've designated three distinct devices, each recognized as a sensor. It's important to emphasize that each sensor is aligned with a specific topic, ensuring a focused channel for data publication to the cloud.

Further, the device-data file encapsulates a comprehensive amalgamation of topics alongside their corresponding attribute-value pairs. This consolidated file presents an organized overview of the collective sensor information.

## [2. Basic_Info_Extractor](https://github.com/researcher06/TestCase-Generation-Parser/tree/main/TestCase_Generation_Parser/Basic_Info_Extractor)
Employing the wealth of codes and data we've meticulously generated, our strategy has evolved into the creation of individualized tables for each integral file. This approach is laying a solid foundation for the eventual seamless integration of our entire framework.

* At the core, we find the sensor info list is a repository meticulously detailing the devices. With precision, it documents each device's assigned topics along with the corresponding attribute-value pairs within those specific topics.

* Moving forward, the TRD table serves as the vault for our rule structures. Within it, an extensive collection of rules is paired with their corresponding SQL queries and the destinations they dictate.

* Parallelly, the ESM table captures the pivotal dynamics of event sources and their designated lambda destinations. Here, the blueprint of data journeys is meticulously laid out.

* The ERD table is a key map of service relationships, meticulously tracing the pathways between sources and destinations, painting a vivid picture of interaction networks.

* The culmination arrives with the RuleData, which harmoniously merges the ESM and TRD tables. This fusion represents a pivotal convergence, forging the road ahead by interweaving event sources, destinations, rules, and SQL queries.

In this strategy, each table contributes a unique layer. As they come together, they form a comprehensive tapestry poised to navigate complexities, ensuring the seamless orchestration of data flow within our framework.

## [3. TestCase_Generator](https://github.com/researcher06/TestCase-Generation-Parser/tree/main/TestCase_Generation_Parser/TestCase_Generator)
Our focus now shifts to our main goal: creating ```lambda coverage``` and ```end-to-end coverage``` paths. These paths are pivotal test cases that validate our solution's effectiveness. By meticulously navigating through sources, rules, destinations, and event sources using our organized tables, we ensure comprehensive coverage. These tests exemplify real-world data movement, demonstrating our solution's reliability and efficiency.

### [a. LambdaCoverage.js](https://github.com/researcher06/TestCase-Generation-Parser/blob/main/TestCase_Generation_Parser/TestCase_Generator/LambdaCoverage.js)
By leveraging the ```Sensor data list``` and the integrated ```Rule Data``` table, we can seamlessly chart a course from a sensor to its corresponding lambda, effectively achieving ```lambda coverage```. The ```Rule Data``` table, born from the fusion of the ```TRD``` and ```ESM``` tables, is the cornerstone, providing the intricate roadmap of rules and destinations.

The synergy between the ```Sensor data list``` and the integrated ```Rule Data``` table is pivotal. This integration empowers us to follow the data's journey through the system, from its origin as sensor data to its ultimate destination at the lambda function. By joining these components, we successfully capture the data flow through the intricate pathways we've outlined. This process culminates in a comprehensive representation of ```lambda coverage```.

#### Algorithm 1 - Test Case Generation for Lambda Coverage
**Require:** $T_{TRD}$, $T_{ESM}$, $T_{ERD}$ <br />
**Require:** $L_{LC}$: List of Lambda Functions <br />
**Ensure:** Table of test requirements for Lambda coverage $T_{LC}$ <br />

Initialize Table $T_{LC}$ with columns LambdaFunctionName, LambdaInvoker ($LI$) and TriggerInfo <br />
**for** each Lambda function $l$ in $L_{LC}$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **if** $l$ ∈ $ActionDestination(T_{TRD}$) **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mark $Invoker$ = $IoTCore$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $LI$ of $l$ = $RuleName(T_{TRD})$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TriggerInfo of $l$ = $SQLQuery(T_{TRD})$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Update $T_{LC}$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Call Parser to get Core_data with TriggerInfo of $l$ <br />
&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $l$ ∈ $EventDestination(T_{ESM})$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mark $Invoker$ = $AWSService$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $LI$ of $l$ = $EventSource(T_{ESM})$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Execute Procedure to find Invoker’s Invoker ($II$) <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Update $T_{LC}$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $Invoker$ = $HTTPRequest$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $LI$ of $l$ = source of the HTTP request, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Querying logs of $l$ Extract TriggerInfo <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Update $TLC$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
**end for** <br />

Procedure to find Invoker’s Invoker ($II$) <br />
**for** each $LI$ ∈ $T_{LC}$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **if** $LI$ ∈ $AWSService$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $LI$ ∈ $ActionDestination(T_{TRD})$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mark $Invoker$ = $IoTCore$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $II$ = $RuleName(T_{TRD})$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TriggerInfo of $l$ = $SQLQuery(T_{TRD})$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; update $T_{LC}$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Call Parser to get Core_data, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $LI$ ∈ $EventDestination(T_{ESM})$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mark $Invoker$ = $AWSService$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;$II$ = $EventSource(T_{ESM})$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;Querying logs of $l$ Extract TriggerInfo <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $LI$ ∈ $EventDestination(T_{ERD})$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mark $Invoker$ = $AWSService$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $II$ = $EventSource(T_{ERD})$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Querying logs of $l$ Extract TriggerInfo <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; update $T_{LC}$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
**end for** <br />
**return** $T_{LC}$, <br />
**repeat** Procedure To find Invoker’s Invoker <br />
**until** $II$ of each $LI$ ∈ $RuleName(T_{TRD})$ <br />

### [b. EndtoEnd_FlowCoverage.js](https://github.com/researcher06/TestCase-Generation-Parser/blob/main/TestCase_Generation_Parser/TestCase_Generator/EndtoEnd_FlowCoverage.js)
```End-to-end coverage``` serves as an extension of ```lambda coverage```, encompassing the entire journey from the lambda function to the final actuator. In this process, we leverage the ```lambda to destination``` files to guide our path. Starting from the lambda, we progress step by step, assessing each transition.

When we encounter an actuator, our objective is met. However, if we encounter a service, we consult the ```ERD table``` to uncover the route to the actuator. For example, if we come across an ```SNS service```, the ```ERD table``` guides us to the actuator.

This meticulous navigation ensures that we explore every aspect of the data's journey, from its origin as sensor data to its ultimate interaction with the actuator. Through this comprehensive approach, we establish a holistic view of data movement, affirming the thoroughness and effectiveness of our solution.

#### Algorithm 2 - Test Case Generation for End-to-End Flow Coverage
**Require:** $T_{ESM}$, $T_{ERD}$ , $LambdaInfoList$, $actuatorInfoList$ <br />
**Ensure:** $T_{EE}$

Initialize End-to-End Flow Table TEE with columns LambdaName, LS, Params <br />
Invoke Algorithm 1 &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; ▷ Return $T_{LC}$ <br />
**for** Each LambdaName $l$ in $T_{LC}$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **if** $targetService(LambdaInfoList)isIotDataorSNS$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mark $FS$ = $Actuator$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $LS$ of $l$ = $targetService(LambdaInfoList)$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Params $l$ = $paramsSent(LambdaInfoList)$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; update $T_{EE}$, <br />
&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $targetService(LambdaInfoList)isDynamoDB$ or $S3$ or $SQS$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $LS$ of $l$ = $targetService(LambdaInfoList)$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Params $l$ = $paramsSent(LambdaInfoList)$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; update $T_{EE}$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; invoke Procedure to find successor’s successor($SS$) <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $targetService(LambdaInfoList)isLambda$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $LS$ of $l$ = $targetService(LambdaInfoList)$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rerun algorithm of EEFC generation for $LS$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $FS$ = $HTTPResponse$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $LS$ of $l$ = EndpointAddress of HTTP request <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; extract the params by querying logs of $l$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; update $T_{EE}$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if**  <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
**end for** <br />

Procedure to find successor’s successor($SS$) <br />
**for** each $LS$ in $T_{EE}$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **if** $LS$ is $DynamoDB$ or $SQS$ or $S3$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $LS$ ∈ $EventSource(T_{ESM})$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $SS$ = $EventDestination(T_{ESM})$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; update $T_{EE}$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rerun algorithm of EEFC generation <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **else** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **if** $LS$ ∈ $EventSource(T_{ERD})$ **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $SS$ = $EventDestination(T_{ERD})$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Params = Querying logs, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Rerun Procedure to find $SS$ for $EventDestination(T_{ERD})$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; update $T_{EE}$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
**end for** <br />
**return** $T_{EE}$ <br />

**for** each $FS$ in $T_{EE}$ **do**, <br />
&nbsp;&nbsp;&nbsp;&nbsp; if ($LS$ or $SS$) ∈ ($HTTP$ or $SNS$ or $IoTData$) **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; get its deviceName from ($actuatorInfoList$) <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end if** <br />
**end for** <br /> <br />

#### Algorithm 3 - Algorithm for test case generation of Event Coverage
**Require:** $T_{TRD}$, $T_{ESM}$, $T_{ERD}$, $LambdaInfoList$, $sensorInfoList$

Initialize $EventCoverageTable$ with columns EGName, ECName, and Event <br />
**if** $choice$ == 1 **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp; EventGenerator(EG) == Sensor & EventConsumer(EC) == IoTCore <br />
&nbsp;&nbsp;&nbsp;&nbsp; **for** every $deviceName$ in $sensorInfoList$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Extract deviceName $params$ from $sensorInfoList$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; EGName = $deviceName$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ECName = $IoTCore$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Event = $params$, <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Append the entry to $EventCoverageTable$ <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end for** <br />
**else if** $choice$ == 2 **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp; EG == IoTCore & EC == AWS Service or Lambda Function <br />
&nbsp;&nbsp;&nbsp;&nbsp; for every $RuleName$ in $T_{TRD}$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Extract ActionDestination, SQLQuery from $T_{TRD}$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; EGName = $IoTCore$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ECName = $ActionDestination$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Event = $SQLQuery$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Append the entry to $EventCoverageTable$ <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end for** <br />
**else if** $choice$ == 3 **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp; EG == Lambda Function & EC == AWS Service or Lambda Function <br />
&nbsp;&nbsp;&nbsp;&nbsp; **for** every $LambdaName$ in $LambdaInfoTable$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Extract target service, paramsSent from $LambdaInfoList$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; EGName = $LambdaName$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ECName = $targetService$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Event = $paramSent$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Append the entry to $EventCoverageTable$ <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end for** <br />
**else if** choice == 4 **then** <br />
&nbsp;&nbsp;&nbsp;&nbsp; EG == AWS Service & EC == Lambda Function <br />
&nbsp;&nbsp;&nbsp;&nbsp; **for** every EventSource in $T_{ESM}$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Extract EventDestination($T_{ESM}$) <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Extract paramGot to EventDestination from $LambdaInfoList$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; EGName = $EventSource$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ECName = $EventDestination$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Event = $paramsRecived$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Append the entry to $EventCoverageTable$ <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end for** <br />
**else** <br />
&nbsp;&nbsp;&nbsp;&nbsp; EG == AWS Service & EC == AWS Service <br />
&nbsp;&nbsp;&nbsp;&nbsp; **for** every EventSource in $T_{ERD}$ **do** <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Extract $EventDestination(T_{ERD})$ <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Event = $pattern(T_{ERD})$ <br />
&nbsp;&nbsp;&nbsp;&nbsp; Append the entry to $EventCoverageTable$ <br />
&nbsp;&nbsp;&nbsp;&nbsp; **end for** <br />
**end if** 

Merge tuples on common $Event$ of $EventCoverageTable$

**return** $EventCoverageTable$
