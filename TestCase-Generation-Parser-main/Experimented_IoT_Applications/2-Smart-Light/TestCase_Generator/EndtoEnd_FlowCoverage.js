
const fs = require("fs");
const path = require("path");

// -------------------------
// Load core JSON assets
// -------------------------
const eventMappings = JSON.parse(
  fs.readFileSync("Assets/EventMapping.json", "utf-8")
);
const rules = JSON.parse(
  fs.readFileSync("Assets/RuleEngine.json", "utf-8")
);
const deviceData = require("./Assets/Device-Data.json");

// -------------------------
// Build Lambda → DestinationService from lambda files
// -------------------------
const lambdaDestinations = new Map();

const destinationMapping = {
  SNS: "SNS",
  IotData: "Actuator",
  S3: "S3",
  DynamoDB: "DynamoDB",
  SQS: "SQS",
  EventBridge: "EventBridge",
};

for (let fileNum = 1; fileNum <= 2; fileNum++) {
  const filePath = path.join("Assets", "lambdaFunctions", `file${fileNum}.js`);
  const fileContent = fs.readFileSync(filePath, "utf-8").split("\n");

  let lambdaName = null;
  let destination = null;

  for (const line of fileContent) {
    const sourceMatch = line.match(/\/\/\s+Lambda\s+"([^"]+)"/);
    if (sourceMatch) {
      lambdaName = sourceMatch[1];
    } else if (line.includes("new AWS.")) {
      const match = line.match(/new\s+AWS\.(\w+)/);
      if (match) {
        const awsService = match[1];
        destination =
          destinationMapping[awsService] ||
          (awsService === "IotData" ? "Actuator" : "Unknown");
      }
      break;
    }
  }

  if (lambdaName && destination) {
    lambdaDestinations.set(lambdaName, destination);
  }
}

// -------------------------
// Build Lambda → RuleName + SQL (like LambdaCoverage)
// -------------------------
const lambdaRules = new Map();

rules.forEach((entry) => {
  const rule = entry.rule;
  const action = rule.actions[0];
  const actionType = Object.keys(action)[0];
  const functionArn = action[actionType].functionArn;
  const lambdaName = functionArn.split(":function:")[1];

  lambdaRules.set(lambdaName, {
    RuleName: rule.ruleName,
    SQLQuery: rule.sql,
  });
});

// -------------------------
// Helper: get all lambdas from EventMapping
// -------------------------
const allLambdas = Array.from(
  new Set(
    eventMappings.map((m) => m.FunctionArn.split(":function:")[1])
  )
);

// -------------------------
// Forward traversal: Lambda → ... → Terminal
// -------------------------
const TERMINALS = new Set([
  "SNS",
  "Actuator",
  "IoT Shadow",
  "IoT Shadow Update",
]);

function resolveTerminalDestination(lambdaName, visited = new Set()) {
  if (visited.has(lambdaName)) return "Unknown";
  visited.add(lambdaName);

  const dest = lambdaDestinations.get(lambdaName) || "Unknown";

  // If terminal, stop
  if (TERMINALS.has(dest)) return dest;

  // Otherwise, try to find successor lambda via EventMapping
  // We assume EventSourceArn contains the service name in lowercase
  const serviceKey = dest.toLowerCase();
  const successorMapping = eventMappings.find((m) =>
    m.EventSourceArn.toLowerCase().includes(serviceKey)
  );

  if (!successorMapping) return dest;

  const successorLambda = successorMapping.FunctionArn.split(":function:")[1];
  return resolveTerminalDestination(successorLambda, visited);
}

// -------------------------
// Device + topic + params mapping (reuse your existing logic)
// -------------------------
const publishRegex = /(\w+)\.publish/g;

function enrichWithDeviceInfo(rows) {
  for (let deviceIndex = 1; deviceIndex <= 2; deviceIndex++) {
    const deviceFileName = `Assets/${deviceIndex}_device.Js`;
    const deviceScriptContent = fs.readFileSync(deviceFileName, "utf-8");

    const objectNamesFromPublish = new Set();
    let publishMatch;

    while ((publishMatch = publishRegex.exec(deviceScriptContent)) !== null) {
      objectNamesFromPublish.add(publishMatch[1]);
    }

    const deviceNameMatch = deviceScriptContent.match(
      /const deviceName = '([^']+)'/
    );
    const deviceName = deviceNameMatch ? deviceNameMatch[1] : "";

    rows.forEach((row) => {
      if (!row.SQLQuery || row.SQLQuery === "N/A") return;

      const sqlFromMatch = row.SQLQuery.match(/FROM "([^"]+)"/);
      if (!sqlFromMatch || !sqlFromMatch[1]) return;

      const topicName = sqlFromMatch[1];

      const associatedObjectName = [...objectNamesFromPublish].find((name) =>
        deviceScriptContent.includes(`${name}.publish("${topicName}"`)
      );

      if (!associatedObjectName) return;

      row["Device Name"] = deviceName;

      const matchingDeviceData = deviceData.find(
        (data) => data.topicFilter === topicName
      );
      if (!matchingDeviceData) return;

      const variableNamesMatch = row.SQLQuery.match(
        /SELECT\s+([\w,\s\*]+)\s+FROM/i
      );

      if (variableNamesMatch) {
        const variableNames = variableNamesMatch[1].split(/\s*,\s*/);
        const payload = matchingDeviceData.messages[0].payload;

        const params = {};
        variableNames.forEach((paramName) => {
          if (paramName !== "*" && payload[paramName] !== undefined) {
            params[paramName] = payload[paramName];
          }
        });

        row["Topic"] = topicName;
        row["Params"] = params;
      } else {
        const params = { ...matchingDeviceData.messages[0].payload };
        delete params.clientId;
        row["Topic"] = topicName;
        row["Params"] = params;
      }
    });
  }
}

// -------------------------
// Build final E2E coverage table
// -------------------------
let E2E_Coverage = [];

allLambdas.forEach((lambdaName) => {
  const ruleInfo = lambdaRules.get(lambdaName) || {
    RuleName: "N/A",
    SQLQuery: "N/A",
  };

  const terminalDest = resolveTerminalDestination(lambdaName);

  E2E_Coverage.push({
    Destination: terminalDest,
    Lambdas: lambdaName,
    Service: "IoTCore Rule Engine", // from your architecture
    RuleName: ruleInfo.RuleName,
    SQLQuery: ruleInfo.SQLQuery,
  });
});

// Enrich with device/topic/params
enrichWithDeviceInfo(E2E_Coverage);

// Destination Path column (same idea as before)
const updatedE2E_Coverage = E2E_Coverage.map((item) => {
  const lowerDest = (item.Destination || "").toLowerCase();

  let destPath = "";
  if (lowerDest === "sns" || lowerDest === "actuator" || lowerDest.includes("shadow")) {
    destPath = "";
  } else {
    destPath = "SNS (Actuator)";
  }

  return { "Destination Path": destPath, ...item };
});

// Final output

updatedE2E_Coverage.forEach(row => { if (row.Params) row.Params = JSON.stringify(row.Params); }); 
// Reorder columns for readability 
const finalTable = updatedE2E_Coverage.map(row => ({ Lambda: row.Lambdas, 
							Rule: row.RuleName, 
							SQL: row.SQLQuery, 
							Device: row["Device Name"], 
							Topic: row.Topic, 
							Params: row.Params, 
							Destination: row.Destination, 
							DestPath: row["Destination Path"], }));
console.table(updatedE2E_Coverage);