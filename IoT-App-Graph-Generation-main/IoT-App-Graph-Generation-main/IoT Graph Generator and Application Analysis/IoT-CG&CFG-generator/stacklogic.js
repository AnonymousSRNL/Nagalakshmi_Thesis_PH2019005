const fs = require('fs');
const readline = require('readline');

class Node {
    constructor(type, value, additional = {}) {
        this.type = type;
        this.value = value;
        Object.assign(this, additional);
    }
}

class Stack {
    constructor() {
        this.stack = [];
    }

    push(node) {
        this.stack.push(node);
    }

    pop() {
        return this.stack.pop();
    }

    peek() {
        return this.stack[this.stack.length - 1];
    }

    size() {
        return this.stack.length;
    }
}

const stack = new Stack();

function safelyParseJSON(data, defaultValue = null) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.warn(`[WARN] Failed to parse JSON: "${data}". Using default value.`);
        return defaultValue;
    }
}

function processLogs(inputFile, outputFile) {
    const readStream = fs.createReadStream(inputFile);
    const rl = readline.createInterface({
        input: readStream,
        output: process.stdout,
        terminal: false,
    });

    const processedLogs = [];
    let combinedNode = null;
    rl.on('line', (line) => {
        if (line.includes('[FUNC ENTER]')) {
            const match = line.match(/\[FUNC ENTER\] (.+?) at \((.+?)\), Args: (.+?), Timestamp: (\d+)/);
            if (match) {
                const [, functionName, location, args, timestamp] = match;
                const node = new Node('function-enter', functionName, {
                    location,
                    args: safelyParseJSON(args, []),
                    timestamp: Number(timestamp),
                });
                stack.push(node);
                processedLogs.push(node);
            }
        }

        if (line.includes('[FUNC EXIT]')) {
            const match = line.match(/\[FUNC EXIT\] (.+?) at \((.+?)\), Return: (.+?), Exception: (.+?), Timestamp: (\d+)/);
            if (match) {
                const [, functionName, location, returnValue, exception, timestamp] = match;
                const node = new Node('function-exit', functionName, {
                    location,
                    returnValue: safelyParseJSON(returnValue),
                    exception: safelyParseJSON(exception, null),
                    timestamp: Number(timestamp),
                });
                stack.push(node);
                processedLogs.push(node);
            }
        }

        if (line.includes('[ASYNC ENTER]')) {
            const match = line.match(/\[ASYNC ENTER\] at \((.+?)\)/);
            if (match) {
                const [,location] = match;
                // console.log(functionName)
                const node = new Node('async-enter', null, {
                    location,
                    timestamp: Date.now(),
                });
                stack.push(node);
                processedLogs.push(node);
            }
        }

        if (line.includes('[ASYNC EXIT]')) {
            const match = line.match(/\[ASYNC EXIT\] at \((.+?)\), Return: (.+?), Exception: (.+?)/);
            if (match) {
                const [, location, returnValue, exception] = match;
                const node = new Node('async-exit', null, {
                    location,
                    returnValue: safelyParseJSON(returnValue),
                    exception: safelyParseJSON(exception, null),
                    timestamp: Date.now(),
                });
                stack.push(node);
                processedLogs.push(node);
            }
        }
        if (line.includes('[AWAIT PRE]')) {
            const match = line.match(/\[AWAIT PRE\] at \((.+?)\), Awaited Value: (.+?)/);
            if (match) {
                const [, location, valAwaited] = match;
                const node = new Node('await-pre', null, {
                    location,
                    awaitedValue: safelyParseJSON(valAwaited),
                    timestamp: Date.now(),
                });
                stack.push(node);
                processedLogs.push(node);
            }
        }

        if (line.includes('[AWAIT POST]')) {
            const match = line.match(/\[AWAIT POST\] at \((.+?)\), Awaited Value: (.+?), Result: (.+?), Status: (rejected|resolved)/);
            if (match) {
                const [, location, valAwaited, result, status] = match;
                const node = new Node('await-post', null, {
                    location,
                    awaitedValue: safelyParseJSON(valAwaited),
                    result: safelyParseJSON(result),
                    status,
                    timestamp: Date.now(),
                });
                stack.push(node);
                processedLogs.push(node);
            }
        }

        if (line.includes('[CONDITIONAL]')) {
            const match = line.match(/\[CONDITIONAL\] Result: (true|false) at \((.+?)\)/);
            if (match) {
                const [, result, location] = match;
                const node = new Node('conditional', result === 'true', {
                    location,
                    timestamp: Date.now(),
                });
                stack.push(node);
                processedLogs.push(node);
            }
        }
        if (line.includes('[READ]')) {
            const match = line.match(/\[(READ)\] (.+?) at \((.+?)\)/);
            if (match) {
                const [, type, value, location] = match;
                const logType = type.toLowerCase();

                if (!combinedNode) {
                    combinedNode = new Node('READ', [], {
                        location,
                        timestamp: Date.now(),
                    });
                }

                combinedNode.value.push({
                    type: logType,
                    value: safelyParseJSON(value, value),
                    location
                });
            }
        }if (line.includes('[WRITE]') ) {
            const match = line.match(/\[(WRITE)\] (.+?) at \((.+?)\)/);
            if (match) {
                const [, type, value, location] = match;
                const logType = type.toLowerCase();

                if (!combinedNode) {
                    combinedNode = new Node('WRITE', [], {
                        location,
                        timestamp: Date.now(),
                    });
                }

                combinedNode.value.push({
                    type: logType,
                    value: safelyParseJSON(value, value),
                    location
                });
            }
        }
         else if (combinedNode) {
            processedLogs.push(combinedNode);
            combinedNode = null;
        }
    });

    rl.on('close', () => {
        try {
            fs.writeFileSync(outputFile, JSON.stringify(processedLogs, null, 2), 'utf-8');
            console.log(`[INFO] Stacked logs written to ${outputFile}`);
        } catch (error) {
            console.error(`[ERROR] Failed to write logs to ${outputFile}:`, error.message);
        }
    });
}

processLogs('../Example-2-Order-Conflict-IoT-App/Results&Graphs/Analysisresult.txt', 'stacked_logs.json');