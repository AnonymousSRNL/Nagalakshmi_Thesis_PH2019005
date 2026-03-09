(function (sandbox) {
    function MyAnalysis() {
        console.log("[DEBUG] MyAnalysis initialized."); 
        this.executionStack = [];
        this.logs = [];

        function safeStringify(obj) {
            const seen = new WeakSet();
            return JSON.stringify(obj, (key, value) => {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) {
                        return "[Circular]";
                    }
                    seen.add(value);
                }
                return value;
            });
        }

        function getPromiseId(promise) {
            return promise && promise.constructor.name === 'Promise' ? promise.toString() : '[Non-Promise]';
        }

        this.functionEnter = function (iid, f, dis, args) {
            var location = J$.iidToLocation(iid);
            var functionName = f.name || '<anonymous>';
            var timestamp = Date.now();
            var argsList = Array.prototype.slice.call(args);

            console.log(`[FUNC ENTER] ${functionName} at ${location}, Args: ${safeStringify(argsList)}, Timestamp: ${timestamp}`);
            
            this.executionStack.push(functionName);
            this.logs.push({
                type: "functionEnter",
                functionName: functionName,
                location: location,
                args: argsList,
                timestamp: timestamp,
            });
        };

        this.functionExit = function (iid, returnVal, exc) {
            var location = J$.iidToLocation(iid);
            var functionName = this.executionStack.pop() || '<unknown>';
            var timestamp = Date.now();

            console.log(`[FUNC EXIT] ${functionName} at ${location}, Return: ${safeStringify(returnVal)}, Exception: ${safeStringify(exc)}, Timestamp: ${timestamp}`);
            
            this.logs.push({
                type: "functionExit",
                functionName: functionName,
                location: location,
                returnValue: returnVal,
                exception: exc,
                timestamp: timestamp,
            });
        };

        this.asyncFunctionEnter = function(iid) {
            var location = J$.iidToLocation(iid);
            console.log(`[ASYNC ENTER] at ${location}`);

            this.logs.push({
                type: "asyncFunctionEnter",
                location: location,
                timestamp: Date.now(),
            });
        };

        this.asyncFunctionExit = function(iid, returnVal, wrappedException) {
            var location = J$.iidToLocation(iid);
            console.log(`[ASYNC EXIT] at ${location}, Return: ${safeStringify(returnVal)}, Exception: ${safeStringify(wrappedException)}`);

            this.logs.push({
                type: "asyncFunctionExit",
                location: location,
                returnValue: returnVal,
                exception: wrappedException,
                timestamp: Date.now(),
            });
        };

        this.awaitPre = function(iid, valAwaited) {
            var location = J$.iidToLocation(iid);
            console.log(`[AWAIT PRE] at ${location}, Awaited Value: ${getPromiseId(valAwaited)}`);

            this.logs.push({
                type: "awaitPre",
                location: location,
                awaitedValue: getPromiseId(valAwaited),
                timestamp: Date.now(),
            });
        };

        this.awaitPost = function(iid, valAwaited, result, rejected) {
            var location = J$.iidToLocation(iid);
            console.log(`[AWAIT POST] at ${location}, Awaited Value: ${getPromiseId(valAwaited)}, Result: ${getPromiseId(result)}, Status: ${rejected ? "rejected" : "resolved"}`);

            this.logs.push({
                type: "awaitPost",
                location: location,
                awaitedValue: getPromiseId(valAwaited),
                result: getPromiseId(result),
                status: rejected ? "rejected" : "resolved",
                timestamp: Date.now(),
            });
        };
        

        this.binary = function(iid, op, left, right, result) {
            var location = J$.iidToLocation(iid);
            console.log(`[BINARY] ${left} ${op} ${right} = ${result} at ${location}`);

            this.logs.push({
                type: "binary",
                operation: op,
                leftOperand: left,
                rightOperand: right,
                result: result,
                location: location,
                timestamp: Date.now(),
            });
        };

        this.literal = function (iid, val) {
            var location = J$.iidToLocation(iid);

            console.log(`[LITERAL] Value: ${safeStringify(val)} at ${location}`);

            this.logs.push({
                type: "literal",
                value: val,
                location: location,
            });
        };

        this.conditional = function (iid, result) {
            var location = J$.iidToLocation(iid);

            console.log(`[CONDITIONAL] Result: ${safeStringify(result)} at ${location}`);

            this.logs.push({
                type: "conditional",
                result: result,
                location: location,
            });
        };

        this.read = function (iid, name, val) {
            var location = J$.iidToLocation(iid);

            console.log(`[READ] Identifier: ${name}, Value at ${location}`);

            this.logs.push({
                type: "read",
                name: name,
                value: val,
                location: location,
            });
        };

        this.write = function (iid, name, val) {
            var location = J$.iidToLocation(iid);

            console.log(`[WRITE] Identifier: ${name}, Value at ${location}`);

            this.logs.push({
                type: "write",
                name: name,
                value: val,
                location: location,
            });
        };
        this._return = function (iid, val) {
            var location = J$.iidToLocation(iid);
            console.log(`[RETURN] at ${location}, Value: ${safeStringify(val)}`);

            this.logs.push({
                type: "return",
                location: location,
                value: val,
                timestamp: Date.now(),
            });
        };
        // this.endExecution = function () {
        //     console.log("[END EXECUTION] Writing logs to instrumentation_logs.json");

        //     try {
        //         require('fs').writeFileSync("instrumentation_logs.json", JSON.stringify(this.logs, null, 2));
        //         console.log("[DEBUG] Logs successfully written.");
        //     } catch (err) {
        //         console.error("[ERROR] Failed to write logs:", err);
        //     }
        // };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);
