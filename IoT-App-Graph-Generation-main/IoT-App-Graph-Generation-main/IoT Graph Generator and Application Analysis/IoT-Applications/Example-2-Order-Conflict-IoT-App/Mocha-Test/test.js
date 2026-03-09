const assert = require('assert');
const sinon = require('sinon');
const fireDetection = require('../fireDetection'); // Assuming main logic is in fireDetection.js
const { createBundle, uploadStr } = require('../fireLambda'); // Separate functions

describe('Fire Detection System', function () {
    let createBundleStub, uploadStrStub;
    let executionOrder = [];

    before(function () {
        console.log(" Setting up Fire Detection Test...");
    });

    beforeEach(function () {
        console.log("Resetting test states...");
        executionOrder = [];
        createBundleStub = sinon.stub().callsFake(() => {
            executionOrder.push('createBundle');
        });
        uploadStrStub = sinon.stub().callsFake(() => {
            executionOrder.push('uploadStr');
        });

        fireDetection.setHandlers(createBundleStub, uploadStrStub);
    });

    it('should execute createBundle and uploadStr in non-deterministic order', function (done) {
        fireDetection.handleFireDetection(100); // Simulate fire detection
        fireDetection.handleFireDetection(120); // Simulate another fire

        setTimeout(() => {
            console.log("Execution Order:", executionOrder);

            // Ensure both functions were called twice
            assert.strictEqual(createBundleStub.callCount, 2, 'createBundle should be called twice');
            assert.strictEqual(uploadStrStub.callCount, 2, 'uploadStr should be called twice');

            // Assert that order is not always the same
            assert.notDeepStrictEqual(executionOrder.slice(0, 2), executionOrder.slice(2, 4), 'Order of execution should not be the same for both calls');

            done();
        }, 100); // Short delay to allow async execution
    });

    afterEach(function () {
        console.log(" Cleaning up after test...");
        sinon.restore();
    });

    after(function () {
        console.log("All Fire Detection tests completed.");
    });
});
