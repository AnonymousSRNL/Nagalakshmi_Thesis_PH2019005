const MQTTBroker = require('./Mqtt');
const ColdChainSensor = require('./coldChainSensor');
const PreprocessingLambda = require('./preprocessingLambda');
const AnalyticsLambda = require('./analyticsLambda');
const StorageService = require('./storageService');
const NotificationService = require('./notificationService');

const broker = new MQTTBroker();

const sensor = new ColdChainSensor('truck-001', broker);

const lambda1 = new PreprocessingLambda(broker);
lambda1.start();

const lambda2 = new AnalyticsLambda(broker);
lambda2.start();

const storage = new StorageService(broker);
storage.start();

const notify = new NotificationService(broker);
notify.start();

sensor.connect();

setTimeout(() => {
    sensor.stop();
}, 12000);
