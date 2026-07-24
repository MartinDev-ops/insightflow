const renameColumn = require("./operations/renameColumn");
const fillMissing = require("./operations/fillMissing");
const deleteDuplicates = require("./operations/deleteDuplicates");
const trimWhitespace = require("./operations/trimWhitespace");

async function editExecutor(workbook, aiResponse) {

    if (!workbook || !Array.isArray(workbook)) {

        return {

            success: false,

            message: "No workbook loaded.",

            workbook

        };

    }

    if (!aiResponse || !aiResponse.operation) {

        return {

            success: false,

            message: "No edit operation specified.",

            workbook

        };

    }

    switch (aiResponse.operation) {

        case "renameColumn":

            return renameColumn(

                workbook,

                aiResponse

            );


        case "fillMissing":

            return fillMissing(

                workbook,

                aiResponse

            );


        case "deleteDuplicates":

            return deleteDuplicates(

                workbook,

                aiResponse

            );


        case "trimWhitespace":

            return trimWhitespace(

                workbook,

                aiResponse

            );


        default:

            return {

                success: false,

                message:

                    `Edit operation "${aiResponse.operation}" is not supported yet.`,

                workbook

            };

    }

}

module.exports = editExecutor;