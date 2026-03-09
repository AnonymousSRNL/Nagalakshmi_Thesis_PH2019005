const fs = require('fs');
const path = require('path');
const { ManageMessageType, WorkerMessageType } = require('./protocol');

// const { createInstrumenter } = require('my-local-instrument');
// const { createInstrumenter } = require('instrument2');
const { createInstrumenter } = require('istanbul-lib-instrument');
const { hookRequire } = require('istanbul-lib-hook');

const instrumenter = createInstrumenter({ compact: true });

hookRequire(
    () => true,
    (code, { filename }) => {
        const newCode = instrumenter.instrumentSync(code, filename);
        return newCode;
    }
);

// const server = path.resolve(process.cwd(), 'Two Sequential Lambdas/server.js');
// const s1 = require(server);
// const server2 = path.resolve(process.cwd(),'Two Sequential Lambdas/secondServer.js');
// const s2 = require(server2);


let sigint = false;
process.on('SIGINT', function () {
    console.log('Received SIGINT. shutting down gracefully');
    sigint = true;
});


class Worker {
    constructor(fn) {
        this.fn = fn;
    }

    getTotalCoverage() {
        let total = 0;
        for (const filePath in global.__coverage__) {
            for (const s in global.__coverage__[filePath].s) {
                total += global.__coverage__[filePath].s[s] ? 1 : 0;
            }
            for (const f in global.__coverage__[filePath].f) {
                total += global.__coverage__[filePath].f[f] ? 1 : 0;
            }
            for (const b in global.__coverage__[filePath].b) {
                for (const i of global.__coverage__[filePath].b[b]) {
                    total += i ? 1 : 0;
                }
            }
        }
        return total;
    }

    dump_coverage() {
        const data = JSON.stringify(global.__coverage__);
        if (!fs.existsSync('./.nyc_output')) {
            fs.mkdirSync('./.nyc_output');
        }
        fs.writeFileSync('./.nyc_output/cov.json', data);
    }

    start() {
        process.on('message', async (m) => {
            try {
                if (m.type === ManageMessageType.WORK) {
                    if (sigint) {
                        this.dump_coverage();
                        process.exit(0);
                    }

                    if (this.fn.constructor.name === 'AsyncFunction') {
                        await this.fn(Buffer.from(m.buf.data));
                    } else {
                        this.fn(Buffer.from(m.buf.data));
                    }

                    process.send({
                        type: WorkerMessageType.RESULT,
                        coverage: this.getTotalCoverage()
                    });
                }
            } catch (e) {
                console.log("=================================================================");
                console.log(e);
                this.dump_coverage();
                process.send({
                    type: WorkerMessageType.CRASH
                });
                process.exit(1);
            }
        });
    }
}



const fuzzTargetPath = path.join(process.cwd(), process.argv[2]);
const fuzzTargetFn = require(fuzzTargetPath).fuzz;
const worker = new Worker(fuzzTargetFn);
worker.start();
