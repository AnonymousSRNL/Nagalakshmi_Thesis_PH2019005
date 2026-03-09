/**
 * Decision Coverage Generator
 * Extracts predicates from Lambda code, TRD SQL, ESM filters, ERD patterns
 * and generates EP + BVA test values.
 */

function extractPredicatesFromLambda(lambdaCode) {
    const predicateRegex = /(if\s*\((.*?)\))/g;
    const predicates = [];
    let match;

    while ((match = predicateRegex.exec(lambdaCode)) !== null) {
        predicates.push(match[2].trim());
    }
    return predicates;
}

function extractPredicatesFromSQL(sqlQuery) {
    const whereIndex = sqlQuery.toLowerCase().indexOf("where");
    if (whereIndex === -1) return [];

    const predicate = sqlQuery.substring(whereIndex + 5).trim();
    return [predicate];
}

function extractPredicatesFromEventPattern(patternObj) {
    const predicates = [];

    function recurse(obj, prefix = "") {
        for (const key in obj) {
            const value = obj[key];
            const path = prefix ? `${prefix}.${key}` : key;

            if (typeof value === "object" && !Array.isArray(value)) {
                recurse(value, path);
            } else {
                predicates.push(`${path} == ${JSON.stringify(value)}`);
            }
        }
    }

    recurse(patternObj);
    return predicates;
}

/**
 * Generate EP + BVA values for simple numeric predicates
 * Example: "x > 700" → [699, 700, 701]
 */
function generateTestValues(predicate) {
    const numericRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*(>=|<=|>|<|==)\s*([0-9]+)/;
    const match = predicate.match(numericRegex);

    if (!match) return ["True case", "False case"];

    const variable = match[1];
    const operator = match[2];
    const constant = Number(match[3]);

    switch (operator) {
        case ">":
            return [constant - 1, constant, constant + 1];
        case "<":
            return [constant - 1, constant, constant + 1];
        case ">=":
            return [constant - 1, constant, constant + 1];
        case "<=":
            return [constant - 1, constant, constant + 1];
        case "==":
            return [constant - 1, constant, constant + 1];
        default:
            return ["True case", "False case"];
    }
}

/**
 * Main Decision Coverage Table Generator
 */
function generateDecisionCoverage(lambdaList, trdList, esmList, erdList) {
    const tableDC = [];

    // 1. Lambda predicates
    lambdaList.forEach(lambda => {
        const preds = extractPredicatesFromLambda(lambda.code);
        preds.forEach(p => {
            tableDC.push({
                component: lambda.name,
                predicate: p,
                testValues: generateTestValues(p)
            });
        });
    });

    // 2. TRD SQL predicates
    trdList.forEach(rule => {
        const preds = extractPredicatesFromSQL(rule.sql);
        preds.forEach(p => {
            tableDC.push({
                component: rule.ruleName,
                predicate: p,
                testValues: generateTestValues(p)
            });
        });
    });

    // 3. ESM predicates
    esmList.forEach(esm => {
        const preds = extractPredicatesFromEventPattern(esm.filter || {});
        preds.forEach(p => {
            tableDC.push({
                component: esm.eventSource,
                predicate: p,
                testValues: ["Match event", "Non-match event"]
            });
        });
    });

    // 4. ERD predicates
    erdList.forEach(erd => {
        const preds = extractPredicatesFromEventPattern(erd.EventPattern || {});
        preds.forEach(p => {
            tableDC.push({
                component: erd.Name,
                predicate: p,
                testValues: ["Match event", "Non-match event"]
            });
        });
    });

    return tableDC;
}
