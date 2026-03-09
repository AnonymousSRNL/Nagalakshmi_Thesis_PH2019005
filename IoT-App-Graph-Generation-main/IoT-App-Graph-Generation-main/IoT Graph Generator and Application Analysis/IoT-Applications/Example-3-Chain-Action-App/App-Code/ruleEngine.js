// ruleEngine.js - Rule engine to trigger Lambda functions
const mqtt = require('./mqtt');
const tempLambda = require('./tempLambda');
const acLambda = require('./acLambda');

class RuleEngine {
    static rule1(temp) {
        console.log('Rule1: Evaluating temperature data...');
        tempLambda(temp);
    }
    
    static rule2(acData) {
        console.log('Rule2: Evaluating AC sensor data...');
        acLambda(acData);
    }
}

module.exports = RuleEngine;