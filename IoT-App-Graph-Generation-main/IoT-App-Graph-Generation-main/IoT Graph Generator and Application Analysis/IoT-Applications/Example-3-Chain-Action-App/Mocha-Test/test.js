const assert = require('assert');
const sinon = require('sinon');
const mqtt = require('../mqtt');
const RuleEngine = require('../ruleEngine');
const tempLambda = require('../tempLambda');
const acLambda = require('../acLambda');

describe('IoT Event-Driven System', function () {
    let tempLambdaStub, acLambdaStub;

    before(function () {
        console.log("⚡ Setting up test environment...");
    });

    beforeEach(function () {
        console.log("🔄 Resetting test states...");
        tempLambdaStub = sinon.stub(tempLambda);
        acLambdaStub = sinon.stub(acLambda);
    });

    it('should execute tempLambda but not acLambda', function (done) {
        const testTemp = 35;

        mqtt.once('acStatus', function (status) {
            assert.strictEqual(tempLambdaStub.calledOnce, true, 'tempLambda should be called once');
            assert.strictEqual(tempLambdaStub.calledWith(testTemp), true, 'tempLambda should be called with testTemp');
            assert.strictEqual(acLambdaStub.notCalled, true, 'acLambda should not be called');
            done();
        });

        RuleEngine.rule1(testTemp);
    });

    afterEach(function () {
        console.log("🧹 Cleaning up after test...");
        sinon.restore();
    });

    after(function () {
        console.log("✅ All tests completed. Cleaning resources...");
    });
});
