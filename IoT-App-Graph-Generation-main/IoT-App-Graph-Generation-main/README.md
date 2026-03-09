# IoT_App_Graph_Generation

## Repository Overview

This repository contains tools and resources for generating and analyzing call and control flow graphs for IoT applications. The structure consists of two main subfolders:

1. **IoT Graph Generators**

   - Contains the implementation of algorithms used to derive call and control flow graphs (CFG) for IoT applications.
   - Includes the Nodeprof analysis file, which processes IoT applications to generate analysis results.
   - Houses the Stack Logic and CFG Generator scripts, which process the results and produce control flow graphs in DOT format.
   - Call Graph Generator, which generates function call graphs for the IoT applications.

2. **IoT Applications**

   - Each subfolder in this directory represents an individual IoT application.
   - Contains the event-driven code for the respective IoT app.
   - Stores analysis output (`output-result.txt`) and generated visualizations(Graphs-IoTCFG and CG).
   - &#x20;Mocha-Test folder contains test cases written using Mocha assertions.

## Workflow

The process of analysis and graph generation follows these steps:

1. **Run Analysis:**

   - Take an IoT application from the `IoT Applications` folder.
   - Execute the analysis script from `IoT Graph Generators` on the selected app.
   - This will generate an `output-result.txt` file inside the corresponding app folder.

2. **Process Analysis Results:**

   - Use the `output-result.txt` file as input for the Stack Logic code (in `IoT Graph Generators`).
   - This generates necessary inputs for the CFG Generator.

3. **Generate Graphs:**

   - Run the CFG Generator to create control flow graphs in DOT format.
   - Run the Call Graph Generator to derive function call graphs.
   - Visualize the graphs and store them in the corresponding app folder.

4. **Repeat:**

   - The same process can be repeated for different IoT applications by following the same workflow.

## Folder Structure

```
|-- IoT_Graph_Generators/
|   |-- analysis-script.js  # Nodeprof analysis file
|   |-- stack-logic/        # Stack logic implementation
|   |-- cfg-generator/      # CFG generator code
|   |-- callgraph-generator/ # Function call graph generator
|
|-- IoT_Applications/
|   |-- App1/
|   |   |-- event-driven-code.js
|   |   |-- output-result.txt  # Generated analysis results
|   |   |-- graphs/  # Visualized control flow graphs
|   |   |-- mocha-test/  # Test cases written using Mocha assertions
|   |-- App2/
|   |   |-- ...
```

## Prerequisites

- Node.js
- Nodeprof.js (a dynamic profiling tool that enables fine-grained analysis of JavaScript applications)&#x20;
- Graphviz (for visualizing DOT files)
- Mocha (for running test cases)

## Running the Analysis

```sh
# Navigate to the IoT_Graph_Generators folder
cd IoT_Graph_Generators

# Run the analysis on an IoT application
node analysis-script.js ../IoT_Applications/App1/event-driven-code.js
```

## Generating Graphs

```sh
# Run stack logic, CFG generator, and call graph generator
node stack-logic/process.js ../IoT_Applications/App1/output-result.txt
node cfg-generator/cfg_gen.js ../IoT_Applications/App1/output-result.txt
node callgraph-generator/callgraph_gen.js ../IoT_Applications/App1/output-result.txt
```

## Running Tests

```sh
# Navigate to the Mocha-Test folder of the application
cd ../IoT_Applications/App1/mocha-test

# Run the test cases
mocha test.js
```

## Visualizing the Graphs

```sh
# Convert DOT file to PNG
dot -Tpng ../IoT_Applications/App1/graphs/cfg.dot -o ../IoT_Applications/App1/graphs/cfg.png
```

