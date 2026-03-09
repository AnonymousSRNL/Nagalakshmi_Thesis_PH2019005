const fs = require("fs");
const path = require("path");
const { uint16, uint32 } = require("./math");
const crypto = require("crypto");

const INTERESTING8 = new Uint8Array([-128, -1, 0, 1, 16, 32, 64, 100, 127]);
const INTERESTING16 = new Uint16Array([-32768, -129, 128, 255, 256, 512, 1000, 1024, 4096, 32767, -128, -1, 0, 1, 16, 32, 64, 100, 127]);
const INTERESTING32 = new Uint32Array([-2147483648, -100663046, -32769, 32768, 65535, 65536, 100663045, 2147483647, -32768, -129, 128, 255, 256, 512, 1000, 1024, 4096, 32767, -128, -1, 0, 1, 16, 32, 64, 100, 127]);

class Corpus {
  constructor(dir, onlyAscii) {
    this.inputs = [];
    this.onlyAscii = onlyAscii;
    this.maxInputSize = 4096;
    for (let i of dir) {
      if (!fs.existsSync(i)) {
        fs.mkdirSync(i);
      }
      if (fs.lstatSync(i).isDirectory()) {
        if (!this.corpusPath) {
          this.corpusPath = i;
        }
        this.loadFiles(i);
      } else {
        this.inputs.push(fs.readFileSync(i));
      }
    }
    this.seedLength = this.inputs.length;
  }

  loadFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
      const full_path = path.join(dir, file);
      this.inputs.push(fs.readFileSync(full_path));
    });
  }

  getLength() {
    return this.inputs.length;
  }

  generateInput() {
    if (this.seedLength > 0) {
      this.seedLength -= 1;
      return this.inputs[this.seedLength];
    }
    if (this.inputs.length === 0) {
      const buf = Buffer.alloc(0, 0);
      this.putBuffer(buf);
      return buf;
    }
    const buffer = this.inputs[this.rand(this.inputs.length)];
    // *** Calls the JSON-aware mutator ***
    return this.mutateJsonAware(buffer);
  }

  putBuffer(buf) {
    this.inputs.push(buf);
    if (this.corpusPath) {
      const filename = crypto.createHash("sha256").update(buf).digest("hex");
      const filepath = path.join(this.corpusPath, filename);
      fs.writeFileSync(filepath, buf);
    }
  }

  randBool() {
    return Math.random() >= 0.5;
  }

  rand(n) {
    return Math.floor(Math.random() * Math.floor(n));
  }

  dec2bin(dec) {
    const bin = dec.toString(2);
    return "0".repeat(32 - bin.length) + bin;
  }

  Exp2() {
    const bin = this.dec2bin(this.rand(2 ** 32));
    let count = 0;
    for (let i = 0; i < 32; i++) {
      if (bin[i] === "0") {
        count += 1;
      } else {
        break;
      }
    }
    return count;
  }

  chooseLen(n) {
    const x = this.rand(100);
    if (x < 90) {
      return this.rand(Math.min(8, n)) + 1;
    } else if (x < 99) {
      return this.rand(Math.min(32, n)) + 1;
    } else {
      return this.rand(n) + 1;
    }
  }

  toAscii(buf) {
    for (let i = 0; i < buf.length; i++) {
      let x = buf[i] & 127;
      if ((x < 0x20 || x > 0x7E) && x !== 0x09 && (x < 0xA || x > 0xD)) {
        buf[i] = 0x20;
      }
    }
  }

  // *** NEW HELPER FUNCTION ***
  // Tries to find a value for the same key and type from another random input.
  getOtherValue(key, type) {
    const TRIES = 10; // Try 10 times before giving up
    for (let i = 0; i < TRIES; i++) {
        const otherRawBuf = this.inputs[this.rand(this.inputs.length)];
        let otherObj;
        try {
            otherObj = JSON.parse(otherRawBuf.toString('utf-8'));
        } catch (e) {
            continue; // Not valid JSON, try again
        }

        // Check if key exists and is the correct type
        if (otherObj && typeof otherObj === 'object' && otherObj[key] !== undefined && typeof otherObj[key] === type) {
            return otherObj[key]; // Success!
        }
    }
    return null; // Failed to find a suitable value
  }


  // *** UPDATED: JSON-aware mutator ***
  mutateJsonAware(buf) {
    let obj;
    try {
        obj = JSON.parse(buf.toString('utf-8'));
    } catch (e) {
        return this.mutate(buf);
    }

    // check for key-value object
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return this.mutate(buf);
    }

    // It is a JSON object. Mutate its values based on type.
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            
            if (typeof value === 'number' && Number.isInteger(value)) {
                const numBuf = Buffer.alloc(4);
                numBuf.writeInt32LE(value, 0);

                // *** new key-aware mutateValue function ***
                let mutatedNumBuf = this.mutateValue(numBuf, key, 'number');

                // Handle buffer size changes from mutation
                if (mutatedNumBuf.length < 4) {
                    const padding = Buffer.alloc(4 - mutatedNumBuf.length, 0);
                    mutatedNumBuf = Buffer.concat([padding, mutatedNumBuf]);
                } else if (mutatedNumBuf.length > 4) {
                    mutatedNumBuf = mutatedNumBuf.subarray(0, 4);
                }
                obj[key] = mutatedNumBuf.readInt32LE(0);

            } else if (typeof value === 'string') {
                const valueBuf = Buffer.from(value, 'utf-8');

                const mutatedValueBuf = this.mutateValue(valueBuf, key, 'string');
                obj[key] = mutatedValueBuf.toString('utf-8');
            }
        }
    }

    const finalBuf = Buffer.from(JSON.stringify(obj), 'utf-8');

    // Apply post-processing
    if (finalBuf.length > this.maxInputSize) {
        return finalBuf.subarray(0, this.maxInputSize);
    }
    if (this.onlyAscii) {
        this.toAscii(finalBuf);
    }
    return finalBuf;
  }

  // *** NEW FUNCTION: A copy of mutate(), but key-aware for splicing ***
  mutateValue(buf, key, type) {
    let res = Buffer.allocUnsafe(buf.length);
        buf.copy(res, 0, 0, buf.length);
        const nm = 1 + this.Exp2();
        for (let i=0; i<nm; i++) {
            const x = this.rand(16);
            if ( x ===0 ) {
                // Remove a range of bytes. (Unchanged)
                if (res.length <= 1) { i--; continue }
                const pos0 = this.rand(res.length);
                const pos1 = pos0 + this.chooseLen(res.length - pos0);
                res.copy(res, pos0, pos1, res.length);
                res = res.slice(0, res.length - (pos1 - pos0));

            } else if (x === 1) {
                // Insert a range of random bytes. (Unchanged)
                const pos = this.rand(res.length + 1);
                const n = this.chooseLen(10);
                res = Buffer.concat([res, Buffer.alloc(n, 0)], res.length + n);
                res.copy(res, pos + n, pos);
                for (let k = 0; k < n; k++) {
                    res[pos + k] = this.rand(256)
                }
            } else if (x === 2) {
                // Duplicate a range of bytes. (Unchanged)
                if (res.length <= 1) { i--; continue }
                const src = this.rand(res.length);
                let dst = this.rand(res.length);
                while (src === dst) { dst = this.rand(res.length); }
                const n = this.chooseLen(res.length - src);
                const tmp = Buffer.alloc(n, 0);
                res.copy(tmp, 0, src);
                res = Buffer.concat([res, Buffer.alloc(n, 0)]);
                res.copy(res, dst+n, dst);
                for (let k=0; k<n; k++) {
                    res[dst+k] = tmp[k]
                }
            } else if (x === 3) {
                // Copy a range of bytes. (Unchanged)
                if (res.length <= 1) { i--; continue }
                const src = this.rand(res.length);
                let dst = this.rand(res.length);
                while (src === dst) { dst = this.rand(res.length); }
                const n = this.chooseLen(res.length - src);
                res.copy(res, dst, src, src+n);
            } else if (x === 4) {
                // Bit flip. (Unchanged)
                if (res.length <= 1) { i--; continue }
                const pos = this.rand(res.length);
                res[pos] ^= 1 << this.rand(8);
            } else if (x === 5) {
                // Set a byte to a random value. (Unchanged)
                if (res.length <= 1) { i--; continue }
                const pos = this.rand(res.length);
                res[pos] ^=  this.rand(255) + 1;
            } else if (x === 6) {
                // Swap 2 bytes. (Unchanged)
                if (res.length <= 1) { i--; continue }
                const src = this.rand(res.length);
                let dst = this.rand(res.length);
                while (src === dst) { dst = this.rand(res.length); }
                [res[src], res[dst]] = [res[dst], res[src]]
            } else if (x === 7) {
                // Add/subtract from a byte. (Unchanged)
                if (res.length === 0) { i--; continue }
                const pos = this.rand(res.length);
                const v = this.rand(35) + 1;
                if (this.randBool()) { res[pos] += v; } else { res[pos] -= v; }
            } else if (x === 8) {
                // Add/subtract from a uint16. (Unchanged)
                if (res.length < 2) { i--; continue }
                const pos = this.rand(res.length - 1);
                let v = this.rand(35) + 1;
                if (this.randBool()) { v = 0 - v; }
                if (this.randBool()) {
                    res.writeUInt16BE(uint16(res.readUInt16BE(pos) + v), pos)
                } else {
                    res.writeUInt16LE(uint16(res.readUInt16LE(pos) + v), pos)
                }
            } else if (x === 9) {
                // Add/subtract from a uint32. (Unchanged)
                if (res.length < 4) { i--; continue }
                const pos = this.rand(res.length - 3);
                let v = this.rand(35) + 1;
                if (this.randBool()) { v = 0 - v; }
                if (this.randBool()) {
                    res.writeUInt32BE(uint32(res.readUInt32BE(pos) + v), pos)
                } else {
                    res.writeUInt32LE(uint32(res.readUInt32LE(pos) + v), pos)
                }
            } else if (x === 10) {
                // Replace a byte with an interesting value. (Unchanged)
                if (res.length === 0) { i--; continue; }
                const pos = this.rand(res.length);
                res[pos] = INTERESTING8[this.rand(INTERESTING8.length)];
            } else if (x === 11) {
                // Replace an uint16 with an interesting value. (Unchanged)
                if (res.length < 2) { i--; continue; }
                const pos = this.rand(res.length - 1);
                if (this.randBool()) {
                    res.writeUInt16BE(INTERESTING16[this.rand(INTERESTING8.length)], pos);
                } else {
                    res.writeUInt16LE(INTERESTING16[this.rand(INTERESTING8.length)], pos);
                }
            } else if (x === 12) {
                // Replace an uint32 with an interesting value. (Unchanged)
                if (res.length < 4) { i--; continue; }
                const pos = this.rand(res.length - 3);
                if (this.randBool()) {
                    res.writeUInt32BE(INTERESTING32[this.rand(INTERESTING8.length)], pos);
                } else {
                    res.writeUInt32LE(INTERESTING32[this.rand(INTERESTING8.length)], pos);
                }
            } else if (x === 13) {
                // Replace an ascii digit with another digit. (Unchanged)
                const digits = [];
                for (let k=0; k<res.length; k++) {
                    if (res[k] >= 48 && res[k] <= 57) { digits.push(k) }
                }
                if (digits.length === 0) { i--; continue; }
                const pos = this.rand(digits.length);
                const was = res[digits[pos]];
                let now = was;
                while (now === was) { now = this.rand(10) + 48 }
                res[digits[pos]] = now
            
            } else if (x === 14) {
                // *** MODIFIED: Splice another *key-specific* input. ***
                if (res.length < 4 || this.inputs.length < 2) { i--; continue; }
                
                const otherVal = this.getOtherValue(key, type);
                if (otherVal === null) { i--; continue; } // Couldn't find one

                let otherBuf;
                if (type === 'number') {
                    otherBuf = Buffer.alloc(4);
                    otherBuf.writeInt32LE(otherVal, 0);
                } else {
                    otherBuf = Buffer.from(otherVal, 'utf-8');
                }

                if (otherBuf.length < 4) { i--; continue; } // Not long enough to splice

                // Find common prefix and suffix.
                let idx0 = 0;
                while (idx0 < res.length && idx0 < otherBuf.length && res[idx0] === otherBuf[idx0]) {
                    idx0++;
                }
                let idx1 = 0;
                while (idx1 < res.length && idx1 < otherBuf.length && res[res.length-idx1-1] === otherBuf[otherBuf.length-idx1-1]) {
                    idx1++;
                }
                const diff = Math.min(res.length-idx0-idx1, otherBuf.length-idx0-idx1);
                if (diff < 4) { i--; continue; } // Not different enough

                otherBuf.copy(res, idx0, idx0, Math.min(otherBuf.length, idx0+this.rand(diff-2)+1))

            } else if (x === 15) {
                // *** MODIFIED: Insert a part of another *key-specific* input. ***
                if (this.inputs.length < 2) { i--; continue; }

                const otherVal = this.getOtherValue(key, type);
                if (otherVal === null) { i--; continue; } // Couldn't find one

                let otherBuf;
                if (type === 'number') {
                    otherBuf = Buffer.alloc(4);
                    otherBuf.writeInt32LE(otherVal, 0);
                } else {
                    otherBuf = Buffer.from(otherVal, 'utf-8');
                }

                if (otherBuf.length < 4) { i--; continue; } // Not long enough

                const pos0 = this.rand(res.length+1);
                const pos1 = this.rand(otherBuf.length-2);
                const n = this.chooseLen(otherBuf.length-pos1-2) + 2;
                res = Buffer.concat([res, Buffer.alloc(n, 0)], res.length + n);
                res.copy(res, pos0+n, pos0);
                for (let k=0; k<n; k++) {
                    res[pos0+k] = otherBuf[pos1+k]
                }
            }
        }

        if (res.length > this.maxInputSize) {
            res = res.subarray(0, this.maxInputSize);
        }
        if (this.onlyAscii) {
            this.toAscii(res);
        }
        return res;
  }

  // *** ORIGINAL MUTATE FUNCTION - UNCHANGED ***
  // This is still used for the fallback case (when input isn't valid JSON)
  mutate(buf) {
    let res = Buffer.allocUnsafe(buf.length);
        buf.copy(res, 0, 0, buf.length);
        const nm = 1 + this.Exp2();
        for (let i=0; i<nm; i++) {
            const x = this.rand(16);
            if ( x ===0 ) {
                // Remove a range of bytes.
                if (res.length <= 1) { i--; continue }
                const pos0 = this.rand(res.length);
                const pos1 = pos0 + this.chooseLen(res.length - pos0);
                res.copy(res, pos0, pos1, res.length);
                res = res.slice(0, res.length - (pos1 - pos0));
            } else if (x === 1) {
                // Insert a range of random bytes.
                const pos = this.rand(res.length + 1);
                const n = this.chooseLen(10);
                res = Buffer.concat([res, Buffer.alloc(n, 0)], res.length + n);
                res.copy(res, pos + n, pos);
                for (let k = 0; k < n; k++) {
                    res[pos + k] = this.rand(256)
                }
            } else if (x === 2) {
                // Duplicate a range of bytes.
                if (res.length <= 1) { i--; continue }
                const src = this.rand(res.length);
                let dst = this.rand(res.length);
                while (src === dst) { dst = this.rand(res.length); }
                const n = this.chooseLen(res.length - src);
                const tmp = Buffer.alloc(n, 0);
                res.copy(tmp, 0, src);
                res = Buffer.concat([res, Buffer.alloc(n, 0)]);
                res.copy(res, dst+n, dst);
                for (let k=0; k<n; k++) {
                    res[dst+k] = tmp[k]
                }
            } else if (x === 3) {
                // Copy a range of bytes.
                if (res.length <= 1) { i--; continue }
                const src = this.rand(res.length);
                let dst = this.rand(res.length);
                while (src === dst) { dst = this.rand(res.length); }
                const n = this.chooseLen(res.length - src);
                res.copy(res, dst, src, src+n);
            } else if (x === 4) {
                // Bit flip. Spooky!
                if (res.length <= 1) { i--; continue }
                const pos = this.rand(res.length);
                res[pos] ^= 1 << this.rand(8);
            } else if (x === 5) {
                // Set a byte to a random value.
                if (res.length <= 1) { i--; continue }
                const pos = this.rand(res.length);
                res[pos] ^=  this.rand(255) + 1;
            } else if (x === 6) {
                // Swap 2 bytes.
                if (res.length <= 1) { i--; continue }
                const src = this.rand(res.length);
                let dst = this.rand(res.length);
                while (src === dst) { dst = this.rand(res.length); }
                [res[src], res[dst]] = [res[dst], res[src]]
            } else if (x === 7) {
                // Add/subtract from a byte.
                if (res.length === 0) { i--; continue }
                const pos = this.rand(res.length);
                const v = this.rand(35) + 1;
                if (this.randBool()) { res[pos] += v; } else { res[pos] -= v; }
            } else if (x === 8) {
                // Add/subtract from a uint16.
                if (res.length < 2) { i--; continue }
                const pos = this.rand(res.length - 1);
                let v = this.rand(35) + 1;
                if (this.randBool()) { v = 0 - v; }
                if (this.randBool()) {
                    res.writeUInt16BE(uint16(res.readUInt16BE(pos) + v), pos)
                } else {
                    res.writeUInt16LE(uint16(res.readUInt16LE(pos) + v), pos)
                }
            } else if (x === 9) {
                // Add/subtract from a uint32.
                if (res.length < 4) { i--; continue }
                const pos = this.rand(res.length - 3);
                let v = this.rand(35) + 1;
                if (this.randBool()) { v = 0 - v; }
                if (this.randBool()) {
                    res.writeUInt32BE(uint32(res.readUInt32BE(pos) + v), pos)
                } else {
                    res.writeUInt32LE(uint32(res.readUInt32LE(pos) + v), pos)
                }
            } else if (x === 10) {
                // Replace a byte with an interesting value.
                if (res.length === 0) { i--; continue; }
                const pos = this.rand(res.length);
                res[pos] = INTERESTING8[this.rand(INTERESTING8.length)];
            } else if (x === 11) {
                // Replace an uint16 with an interesting value.
                if (res.length < 2) { i--; continue; }
                const pos = this.rand(res.length - 1);
                if (this.randBool()) {
                    res.writeUInt16BE(INTERESTING16[this.rand(INTERESTING8.length)], pos);
                } else {
                    res.writeUInt16LE(INTERESTING16[this.rand(INTERESTING8.length)], pos);
                }
            } else if (x === 12) {
                // Replace an uint32 with an interesting value.
                if (res.length < 4) { i--; continue; }
                const pos = this.rand(res.length - 3);
                if (this.randBool()) {
                    res.writeUInt32BE(INTERESTING32[this.rand(INTERESTING8.length)], pos);
                } else {
                    res.writeUInt32LE(INTERESTING32[this.rand(INTERESTING8.length)], pos);
                }
            } else if (x === 13) {
                // Replace an ascii digit with another digit.
                const digits = [];
                for (let k=0; k<res.length; k++) {
                    if (res[k] >= 48 && res[k] <= 57) { digits.push(k) }
                }
                if (digits.length === 0) { i--; continue; }
                const pos = this.rand(digits.length);
                const was = res[digits[pos]];
                let now = was;
                while (now === was) { now = this.rand(10) + 48 }
                res[digits[pos]] = now
            } else if (x === 14) {
                // Splice another input.
                if (res.length < 4 || this.inputs.length < 2) { i--; continue; }
                const other = this.inputs[this.rand(this.inputs.length)];
                if (other.length < 4) { i--; continue; }
                // Find common prefix and suffix.
                let idx0 = 0;
                while (idx0 < res.length && idx0 < other.length && res[idx0] === other[idx0]) {
                    idx0++;
                }
                let idx1 = 0;
                while (idx1 < res.length && idx1 < other.length && res[res.length-idx1-1] === other[other.length-idx1-1]) {
                    idx1++;
                }
                const diff = Math.min(res.length-idx0-idx1, other.length-idx0-idx1);
                if (diff < 4) { i--; continue; }
                other.copy(res, idx0, idx0, Math.min(other.length, idx0+this.rand(diff-2)+1))
            } else if (x === 15) {
                // Insert a part of another input.
                if (res.length < 4 || this.inputs.length < 2) { i--; continue; }
                const other = this.inputs[this.rand(this.inputs.length)];
                if (other.length < 4) { i--; continue; }
                const pos0 = this.rand(res.length+1);
                const pos1 = this.rand(other.length-2);
                const n = this.chooseLen(other.length-pos1-2) + 2;
                res = Buffer.concat([res, Buffer.alloc(n, 0)], res.length + n);
                res.copy(res, pos0+n, pos0);
                for (let k=0; k<n; k++) {
                    res[pos0+k] = other[pos1+k]
                }
            }
        }

        if (res.length > this.maxInputSize) {
            res = res.subarray(0, this.maxInputSize);
        }
        if (this.onlyAscii) {
            this.toAscii(res);
        }
        return res;
  }
}

module.exports = { Corpus };