const fs = require('fs');
const graphviz = require('graphviz');

// Load the stacked logs JSON
function loadLogs(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[ERROR] Failed to load logs from ${filePath}:`, error.message);
        return [];
    }
}

function buildDot(logs) {
    const g = graphviz.digraph("CFG"); // Create a directed graph

    // Track the current function stack and previous node
    const functionStack = [];
    let previousNode = null;

    logs.forEach((log, index) => {
        let currentNode = null;

        if (log.type === 'function-enter') {
            currentNode = `FUNC_ENTER_${log.value}_${index}`;
            g.addNode(currentNode, {
                label: `Function Enter: ${log.value} \n Location: ${log.location}`,
                shape: 'box',
                color: 'blue',
            });

            if (previousNode) {
                g.addEdge(previousNode, currentNode, { label: 'call' });
            }

            functionStack.push(currentNode);
            previousNode = currentNode;
        } else if (log.type === 'function-exit') {
            currentNode = `FUNC_EXIT_${log.value}_${index} `;
            g.addNode(currentNode, {
                label: `Function Exit: ${log.value} \n Location: ${log.location}`,
                shape: 'box',
                color: 'green',
            });

            const lastFunction = functionStack.pop();
            if (lastFunction) {
                g.addEdge(lastFunction, currentNode, { label: 'return' });
            }

            previousNode = currentNode;
        } else if (log.type === 'async-enter') {
            currentNode = `ASYNC_ENTER_${index}`;
            // console.log(log.location)
            g.addNode(currentNode, {
                label: `Async Enter : \n Location: ${log.location}`,
                shape: 'ellipse',
                color: 'purple',
            });

            if (previousNode) {
                g.addEdge(previousNode, currentNode, { label: 'async call' });
            }

            functionStack.push(currentNode);
            previousNode = currentNode;
        } else if (log.type === 'async-exit') {
            currentNode = `ASYNC_EXIT_${index}`;
            g.addNode(currentNode, {
                label: `Async Exit \n Location: ${log.location}`,
                shape: 'ellipse',
                color: 'pink',
            });

            const lastAsync = functionStack.pop();
            if (lastAsync) {
                g.addEdge(lastAsync, currentNode, { label: 'async return' });
            }

            previousNode = currentNode;
        } else if (log.type === 'conditional') {
            currentNode = `COND_${index}`;
            g.addNode(currentNode, {
                label: `Conditional: ${log.value} \n Location: ${log.location}`,
                shape: 'diamond',
                color: 'orange',
            });

            if (previousNode) {
                g.addEdge(previousNode, currentNode, { label: 'branch' });
            }

            previousNode = currentNode;
        } else if (log.type === 'READ') {
            currentNode = `COMBINED_${index}`;
            
            // Extract action types and set label
            const actionTypes = log.value.map(action => action.type.toUpperCase()).join(', ');
            const label = 'READ';

            g.addNode(currentNode, {
                label:`${label} \n Location: ${log.location}` ,
                shape: 'box',
                color: 'yellow',
            });

            if (previousNode) {
                g.addEdge(previousNode, currentNode, { label: 'combined' });
            }

            previousNode = currentNode;
        }
        else if (log.type === 'WRITE') {
            currentNode = `COMBINED_${index}`;
            
            // Extract action types and set label
            const actionTypes = log.value.map(action => action.type.toUpperCase()).join(', ');
            const label = 'WRITE';

            g.addNode(currentNode, {
                label:`${label} \n Location: ${log.location}` ,
                shape: 'box',
                color: 'yellow',
            });

            if (previousNode) {
                g.addEdge(previousNode, currentNode, { label: 'combined' });
            }

            previousNode = currentNode;
        }
    });

    return g;
}
// Render the Graphviz output
function renderGraph(dotGraph, outputFile) {
    dotGraph.output("png", outputFile, (error) => {
        if (error) {
            console.error(`[ERROR] Failed to render graph:`, error.message);
        } else {
            console.log(`[INFO] Graph saved to ${outputFile}`);
        }
    });
}

// Main function
function main() {
    const logs = loadLogs('stacked_logs.json');
    if (!logs.length) return;

    const dotGraph = buildDot(logs);
    renderGraph(dotGraph, 'cfg_output.png');
}

main();
