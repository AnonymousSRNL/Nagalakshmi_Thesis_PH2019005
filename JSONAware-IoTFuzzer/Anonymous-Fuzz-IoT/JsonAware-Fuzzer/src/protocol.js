const WorkerMessageType = Object.freeze({
    RESULT: 0,
    CRASH: 1
});

/**
 * @typedef {Object} WorkerMessage
 * @property {number} type - Should be one of WorkerMessageType
 * @property {number} coverage
 * @property {number} error
 */

const ManageMessageType = Object.freeze({
    WORK: 0,
    STOP: 1
});

/**
 * @typedef {Object} ManagerMessage
 * @property {number} type - Should be one of ManageMessageType
 * @property {string} buf - Input buffer string
 */

module.exports = {
    WorkerMessageType,
    ManageMessageType
};
