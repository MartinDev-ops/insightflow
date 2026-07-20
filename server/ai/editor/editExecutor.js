const renameColumn = require("./operations/renameColumn");
const fillMissing = require("./operations/fillMissing");
const deleteDuplicates = require("./operations/deleteDuplicates");
const trimWhitespace = require("./operations/trimWhitespace");

async function editExecutor(workbook, aiResponse) {

    switch (aiResponse.operation) {

        case "renameColumn":

            return renameColumn(workbook, aiResponse);

        case "fillMissing":

            return fillMissing(workbook, aiResponse);

        case "deleteDuplicates":

            return deleteDuplicates(workbook, aiResponse);

        case "trimWhitespace":

            return trimWhitespace(workbook, aiResponse);

        default:

            return {

                success: false,

                message: "Edit operation not supported.",

                workbook

            };

    }

}

module.exports = editExecutor;