Testing of Cloud-Based IoT Applications – Thesis Implementation

This repository contains the implementation artifacts developed as part of the PhD thesis on the analysis and testing of cloud-based IoT applications. The work focuses on improving the reliability and verification of IoT systems deployed on modern cloud and serverless platforms.

Repository Structure

The repository is organized into three folders corresponding to the three research contributions of the thesis.
Testing-of-IoT-Applications
│
├── Architecture-Based-Testing
├── CallGraph-ControlFlow-Analysis
├── IoT-Fuzzer
└── README.md
Research Contributions
1. Architecture-Based Testing Framework

This work proposes a generic architecture model for cloud-based IoT systems and a test case generation framework based on architecture-level coverage criteria. The framework enables detection of faults arising from complex interactions between system components and connections.

The current implementation focuses on synchronous interactions, with planned extensions to support asynchronous event handling in Node.js-based IoT applications.

2. Call Graph and Control Flow Analysis

This work introduces call graph and control-flow graph representations tailored for IoT applications deployed on serverless platforms.

The graphs are constructed using a combination of static parsing and dynamic execution techniques, enabling developers to analyze execution paths and verify assertions within IoT applications.

3. Coverage-Guided Fuzz Testing

This work presents a coverage-guided fuzzer designed for cloud-based IoT applications.

The fuzzer performs structure-aware JSON mutation and coverage collection across asynchronous serverless executions, enabling improved exploration of application behaviors.

Future work includes MQTT protocol mutation and reachability analysis to detect vulnerable system states in IoT applications.

Technologies Used

Node.js

JavaScript

MQTT Protocol

Serverless Cloud Platforms

Static and Dynamic Program Analysis

Coverage-Guided Fuzz Testing
