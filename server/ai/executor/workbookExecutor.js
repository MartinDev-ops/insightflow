const filterExecutor = require("./filterExecutor");
const sortExecutor = require("./sortExecutor");
const aggregateExecutor = require("./aggregateExecutor");
const chartExecutor = require("./chartExecutor");

async function executeIntent(workbook, aiResponse) {

    switch (aiResponse.intent) {

        case "filter":

            return filterExecutor(workbook, aiResponse);

        case "sort":

            return sortExecutor(workbook, aiResponse);

        case "aggregate":

            return aggregateExecutor(workbook, aiResponse);

        case "chart":

            return chartExecutor(workbook, aiResponse);

        case "general":

            return {

                type: "message",

                message: aiResponse.message

            };

        case "unknown":

            return {

                type: "message",

                message:
                    "I couldn't understand that request."

            };

        default:

            return {

                type: "message",

                message:
                    "That operation is not supported yet."

            };

    }

}

module.exports = executeIntent;