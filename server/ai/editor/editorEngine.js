const createColumn = require("./createColumn");
const renameColumn = require("./renameColumn");
const deleteColumn = require("./deleteColumn");
const fillMissing = require("./fillMissing");
const cleanWorkbook = require("./cleanWorkbook");

async function editorEngine(workbook, aiResponse) {

    const operation =

        aiResponse.operation ||

        aiResponse.action;


    switch (operation) {

        case "createColumn":

            return createColumn(

                workbook,

                aiResponse

            );


        case "renameColumn":

            return renameColumn(

                workbook,

                aiResponse

            );


        case "deleteColumn":

            return deleteColumn(

                workbook,

                aiResponse

            );


        case "fillMissing":

            return fillMissing(

                workbook,

                aiResponse

            );


        case "clean":

            return cleanWorkbook(

                workbook,

                aiResponse

            );


        default:

            return {

                success: false,

                message:

                    `Unknown edit operation: ${operation}`

            };

    }

}

module.exports = editorEngine;