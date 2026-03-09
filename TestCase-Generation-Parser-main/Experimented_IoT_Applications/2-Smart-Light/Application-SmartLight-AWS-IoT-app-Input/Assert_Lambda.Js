exports.handler = async (event) => {
    var assert = require('assert');
    assert(event['lightOnDuration'] >= 3 * 60);
};