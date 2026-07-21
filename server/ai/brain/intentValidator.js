const VALID_INTENTS = [

    "filter",

    "sort",

    "aggregate",

    "chart",

    "update",

    "clean",

    "general",

    "unknown"

];

const VALID_OPERATORS = [
    "equals",
    "not_equals",
    "contains",
    "greater_than",
    "less_than",
    "greater_equal",
    "less_equal",
    "year_equals"
];

function isNonEmptyString(value) {

    return typeof value === "string" && value.trim().length > 0;

}

function validateConditions(conditions) {

    if (!Array.isArray(conditions) || conditions.length === 0) {

        return "conditions must be a non-empty array for a filter intent";

    }

    for (let i = 0; i < conditions.length; i++) {

        const condition = conditions[i];

        if (!condition || typeof condition !== "object") {

            return `condition[${i}] is not an object`;

        }

        if (!isNonEmptyString(condition.column)) {

            return `condition[${i}].column is missing`;

        }

        if (!VALID_OPERATORS.includes(condition.operator)) {

            return `condition[${i}].operator "${condition.operator}" is not supported`;

        }

        if (condition.value === undefined || condition.value === null) {

            return `condition[${i}].value is missing`;

        }

    }

    return null;

}

// Per-intent extra checks, beyond just "is the intent name valid".
// Each returns either a reason string (invalid) or null (valid).
const INTENT_CHECKS = {

    filter(aiResponse) {

        return validateConditions(aiResponse.conditions);

    },

    sort(aiResponse) {

        if (!isNonEmptyString(aiResponse.sortColumn)) {

            return "sortColumn is required for a sort intent";

        }

        if (aiResponse.sortDirection &&
            !["asc", "desc"].includes(aiResponse.sortDirection)) {

            return 'sortDirection must be "asc" or "desc"';

        }

        return null;

    },

    aggregate(aiResponse) {

        const allowedFunctions = [
            "sum", "total",
            "average", "avg", "mean",
            "count", "number",
            "max", "maximum", "highest",
            "min", "minimum", "lowest"
        ];

        if (!allowedFunctions.includes(String(aiResponse.function).toLowerCase())) {

            return `aggregate function "${aiResponse.function}" is not supported`;

        }

        if (aiResponse.function !== "count" && !isNonEmptyString(aiResponse.column)) {

            return "column is required for this aggregate function";

        }

        return null;

    },

    chart(aiResponse) {

        const allowedChartTypes = ["pie", "bar", "line"];

        if (!allowedChartTypes.includes(aiResponse.chartType)) {

            return `chartType "${aiResponse.chartType}" is not supported`;

        }

        if (!isNonEmptyString(aiResponse.groupBy)) {

            return "groupBy is required for a chart intent";

        }

        return null;

    },

    update(aiResponse) {

        return isNonEmptyString(aiResponse.action)
            ? null
            : "action is required for an update intent";

    },

    clean(aiResponse) {

        return isNonEmptyString(aiResponse.action)
            ? null
            : "action is required for a clean intent";

    },

    general(aiResponse) {

        return isNonEmptyString(aiResponse.message)
            ? null
            : "message is required for a general intent";

    },

    unknown() {

        return null;

    }

};

function validateIntent(aiResponse) {

    if (!aiResponse) {

        return {

            valid: false,

            reason: "Empty AI response."

        };

    }

    if (!aiResponse.intent) {

        return {

            valid: false,

            reason: "No intent returned."

        };

    }

    if (!VALID_INTENTS.includes(aiResponse.intent)) {

        return {

            valid: false,

            reason: `Unsupported intent: ${aiResponse.intent}`

        };

    }

    const check = INTENT_CHECKS[aiResponse.intent];

    const failureReason = check ? check(aiResponse) : null;

    if (failureReason) {

        return {

            valid: false,

            reason: failureReason

        };

    }

    return {

        valid: true,

        intent: aiResponse.intent

    };

}

module.exports = {

    validateIntent

};