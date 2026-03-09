// LambdaCoverage.js
// Clean, modern, enriched Lambda Coverage with Device + Topic + Params

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
// Build Lambda → RuleName + SQL
// -------------------------
const lambdaCoverage = [];

rules.forEach((entry) => {
  const rule = entry.rule;
  const action = rule.actions[0];
  const actionType = Object.keys(action)[0];
  const functionArn = action[actionType].functionArn;
  const lambdaName = functionArn.split(":function:")[1];

  lambdaCoverage.push({
    Lambdas: lambdaName,
    Service: "IoTCore Rule Engine",
    RuleName: rule.ruleName,
    SQLQuery: rule.sql
  });
});

// -------------------------
// Extract topic from SQL
// -------------------------
function extractTopic(sql) {
  const match = sql.match(/FROM\s+"([^"]+)"/i);
  return match ? match[1] : null;
}

// -------------------------
// Enrich LambdaCoverage with Device + Topic + Params
// -------------------------
lambdaCoverage.forEach((row) => {
  if (!row.SQLQuery || row.SQLQuery === "N/A") return;

  const topic = extractTopic(row.SQLQuery);
  if (!topic) return;

  row.Topic = topic;

  // Match topic with Device-Data.json
  const matchingDeviceData = deviceData.find(
    (d) => d.topicFilter === topic
  );
  if (!matchingDeviceData) return;

  const payload = matchingDeviceData.messages[0].payload;

  // Extract SELECT fields
  const selectMatch = row.SQLQuery.match(/SELECT\s+(.+?)\s+FROM/i);
  if (!selectMatch) return;

  const fields = selectMatch[1].split(",").map((f) => f.trim());

  const params = {};
  fields.forEach((f) => {
    if (payload[f] !== undefined) {
      params[f] = payload[f];
    }
  });

  row.Params = params;
  row["Device Name"] = payload.sensorId || "Unknown";
});

// -------------------------
// Convert Params to JSON for console.table
// -------------------------
lambdaCoverage.forEach((row) => {
  if (row.Params) {
    row.Params = JSON.stringify(row.Params);
  }
});

// -------------------------
// Print final enriched Lambda Coverage
// -------------------------
console.table(lambdaCoverage);
