/**
 * Rounds a uint8 up to the next higher power of two, with zero remaining at
 * zero. About 5x faster than Math.* ops and we abuse this function a lot.
 *
 * From the bit twiddling hacks site:
 * http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
 */
function roundUint8ToNextPowerOfTwo(value) {
    value -= 1;
    value |= value >>> 1;
    value |= value >>> 2;
    value |= value >>> 4;
    value += 1;
    return value;
}

/**
 * Returns a random integer in the range [0, max)
 */
function randInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Chooses a random value from the array and returns it.
 */
function pickRandomOne(arr) {
    return arr[randInt(arr.length)];
}

function uint32(n) {
    return (n & 0xffffffff) >>> 0;
}

function uint16(n) {
    return (n & 0xffff) >>> 0;
}

function uint8(n) {
    return (n & 0xff) >>> 0;
}

module.exports = {
    roundUint8ToNextPowerOfTwo,
    randInt,
    pickRandomOne,
    uint32,
    uint16,
    uint8
};
