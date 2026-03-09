const fs = require('fs');
const { exec } = require('child_process');

// Read logs from file
const logs = fs.readFileSync('result.txt', 'utf8');

// Regular expressions for function enter and exit
const enterPattern = /\[FUNC ENTER\] (.+?) at \((.+?):(\d+)\), Args: (.+?), Timestamp: (\d+)/;
const exitPattern = /\[FUNC EXIT\] (.+?) at \((.+?):(\d+)\), Return: (.+?), Exception: (.+?), Timestamp: (\d+)/;

// Stack to track function calls
const callStack = [];
const functionCalls = new Map();
const returnEdges = new Map();

let anonymousCounter = 0;

function formatTimestampToIST(timestamp) {
    var date = new Date(parseInt(timestamp));
    var istDate = new Date(date.getTime());
    return (
        (istDate.getMonth() + 1) + '/' + istDate.getDate() + '/' + istDate.getFullYear() +
        ' ' + istDate.getHours().toString().padStart(2, '0') + ':' +
        istDate.getMinutes().toString().padStart(2, '0') + ':' +
        istDate.getSeconds().toString().padStart(2, '0') + ' IST'
    );
}

// Function to generate a unique key for nodes based on function name and line number
function generateNodeKey(funcName, file, lineNumber) {
    return `${funcName} (${file}:${lineNumber})`;
}

// Parse logs
logs.trim().split('\n').forEach(line => {
    const enterMatch = enterPattern.exec(line);
    const exitMatch = exitPattern.exec(line);

    if (enterMatch) {
        let [_, funcName, file, lineNumber, args, timestamp] = enterMatch;

        args = JSON.parse(args);
        timestamp = parseInt(timestamp, 10);
        const formattedTimestamp = formatTimestampToIST(timestamp);

        if (funcName === '<anonymous>') {
            anonymousCounter++;
            funcName = `anonymous_${anonymousCounter}`;
        }

        const nodeKey = generateNodeKey(funcName, file, lineNumber);

        // Get the parent function from the stack if it exists
        if (callStack.length > 0) {
            const parent = callStack[callStack.length - 1];
            const parentKey = generateNodeKey(parent.funcName, parent.file, parent.lineNumber);
            
            if (!functionCalls.has(parentKey)) {
                functionCalls.set(parentKey, new Set());
            }
            functionCalls.get(parentKey).add(nodeKey);
        }

        // Push the current function to the stack
        callStack.push({ funcName, file, lineNumber, args, timestamp: formattedTimestamp });
    } else if (exitMatch) {
        let [_, funcName, file, lineNumber, returnValue, exception, timestamp] = exitMatch;

        timestamp = parseInt(timestamp, 10);
        const formattedTimestamp = formatTimestampToIST(timestamp);
        const nodeKey = generateNodeKey(funcName, file, lineNumber);

        if (callStack.length > 0) {
            const lastFunction = callStack.pop();
            const lastKey = generateNodeKey(lastFunction.funcName, lastFunction.file, lastFunction.lineNumber);

            if (lastKey === nodeKey) {
                if (!returnEdges.has(lastKey)) {
                    returnEdges.set(lastKey, { funcName, file, lineNumber, returnValue, exception, timestamp: formattedTimestamp });
                }
            }
        }
    }
});

// Generate Graphviz DOT representation
let dot = 'digraph FunctionCalls {\n';
dot += '    node [shape=box];\n';
dot += '    edge [color=black];\n';

// Function to safely escape Graphviz labels
function escapeLabel(text) {
    return text.replace(/"/g, '\\"'); // Escape double quotes
}

// Merge nodes by line numbers and create edges
functionCalls.forEach((children, parent) => {
    children.forEach(child => {
        const parentLabel = escapeLabel(parent);
        const childLabel = escapeLabel(child);
        dot += `    "${parentLabel}" -> "${childLabel}";\n`;
    });
});

// Add return edges with dashed red lines
returnEdges.forEach((to, from) => {
    const fromLabel = escapeLabel(from);
    const toLabel = escapeLabel(generateNodeKey(to.funcName, to.file, to.lineNumber));
    dot += `    "${fromLabel}" -> "${toLabel}" [label="return", style=dashed, color=red];\n`;
});

dot += '}';

// Write DOT file
fs.writeFileSync('function_calls.dot', dot);

// Generate PNG using Graphviz
exec('dot -Tpng function_calls.dot -o function_calls.png', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error generating graph: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Graphviz stderr: ${stderr}`);
        return;
    }
    console.log('Function call graph generated: function_calls.png');
});


// const fs = require('fs');
// const { exec } = require('child_process');

// const logs = fs.readFileSync('result.txt', 'utf8');

// const enterPattern = /\[FUNC ENTER\] (.+?) at \((.+?):(\d+)\), Args: (.+?), Timestamp: (\d+)/;
// const exitPattern = /\[FUNC EXIT\] (.+?) at \((.+?):(\d+)\), Return: (.+?), Exception: (.+?), Timestamp: (\d+)/;

// const nodes = new Map(); // Stores merged function calls by file:lineNumber
// const edges = new Map(); // Tracks relationships (parent -> child)

// let anonymousCounter = 0;
// const callStack = [];

// logs.trim().split('\n').forEach(line => {
//     const enterMatch = enterPattern.exec(line);
//     const exitMatch = exitPattern.exec(line);

//     if (enterMatch) {
//         let [_, funcName, file, lineNumber, args, timestamp] = enterMatch;

//         args = JSON.parse(args);
//         timestamp = parseInt(timestamp, 10);

//         if (funcName === '<anonymous>') {
//             anonymousCounter++;
//             funcName = `anonymous_${anonymousCounter}`;
//         }

//         const key = `${file}:${lineNumber}`;
//         if (!nodes.has(key)) {
//             nodes.set(key, new Set());
//         }
//         nodes.get(key).add(funcName);

//         if (callStack.length > 0) {
//             const parentKey = callStack[callStack.length - 1];
//             if (!edges.has(parentKey)) {
//                 edges.set(parentKey, new Set());
//             }
//             edges.get(parentKey).add(key);
//         }

//         callStack.push(key);
//     } else if (exitMatch) {
//         let [_, funcName, file, lineNumber, returnValue, exception, timestamp] = exitMatch;
//         timestamp = parseInt(timestamp, 10);
//         const key = `${file}:${lineNumber}`;

//         if (callStack.length > 0 && callStack[callStack.length - 1] === key) {
//             callStack.pop();
//         }
//     }
// });

// // Generate Graphviz DOT representation
// let dot = 'digraph FunctionCalls {\n';
// dot += '    node [shape=box];\n';

// dot += '    edge [dir=both, color=black];\n';

// // Define nodes
// nodes.forEach((funcSet, key) => {
//     const label = `${Array.from(funcSet).join(', ')}\n${key.replace(/"/g, '\\"')}`;
//     dot += `    "${key}" [label="${label}"];\n`;
// });

// // Define edges
// edges.forEach((children, parent) => {
//     children.forEach(child => {
//         dot += `    "${parent}" -> "${child}";\n`;
//     });
// });

// dot += '}';

// // Write DOT file
// fs.writeFileSync('function_calls.dot', dot);

// // Generate PNG using Graphviz
// exec('dot -Tpng function_calls.dot -o function_calls.png', (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error generating graph: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`Graphviz stderr: ${stderr}`);
//         return;
//     }
//     console.log('Function call graph generated: function_calls.png');
// });
