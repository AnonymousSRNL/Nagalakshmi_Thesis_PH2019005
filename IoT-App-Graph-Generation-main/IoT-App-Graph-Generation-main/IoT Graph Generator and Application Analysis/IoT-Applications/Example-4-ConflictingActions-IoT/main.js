const MQTTBroker = require('./Mqtt');
const VehicleSensor = require('./vehicleSensor');
const FireSafetyApp = require('./fireSafetyApp');
const CollisionAvoidanceApp = require('./collisionAvoidanceApp');
const CommandResolver = require('./commandResolver');
const DriverControlUnit = require('./driverControlUnit');

const broker = new MQTTBroker();

const sensor = new VehicleSensor('vehicle-001', broker);

const fireApp = new FireSafetyApp(broker);
fireApp.start();

const collisionApp = new CollisionAvoidanceApp(broker);
collisionApp.start();

const resolver = new CommandResolver(broker);
resolver.start();

const driver = new DriverControlUnit(broker);
driver.start();

sensor.connect();

setTimeout(() => sensor.stop(), 12000);
