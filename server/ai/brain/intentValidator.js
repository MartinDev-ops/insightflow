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

    return {

        valid: true,

        intent: aiResponse.intent

    };

}

module.exports = {

    validateIntent

};