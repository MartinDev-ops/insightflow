const filterExecutor =
    require("./filterExecutor");

const sortExecutor =
    require("./sortExecutor");

const aggregateExecutor =
    require("./aggregateExecutor");

const chartExecutor =
    require("./chartExecutor");

const editExecutor =
    require("../editor/editExecutor");


async function executeIntent(

    workbook,

    aiResponse

) {

    console.log(

        "AI RESPONSE RECEIVED:",

        JSON.stringify(

            aiResponse,

            null,

            2

        )

    );


    //--------------------------------
    // UPDATE / EDIT OPERATIONS
    //--------------------------------

    if (

        aiResponse.intent === "update"

        ||

        aiResponse.route === "edit"

    ) {

        console.log(

            "✅ EDIT ROUTE DETECTED"

        );


        const operation =

            aiResponse.operation

            ||

            aiResponse.action;


        console.log(

            "EDIT OPERATION:",

            operation

        );


        return editExecutor(

            workbook,

            {

                ...aiResponse,

                operation

            }

        );

    }


    //--------------------------------
    // CLEAN OPERATIONS
    //--------------------------------

    if (

        aiResponse.intent === "clean"

    ) {

        console.log(

            "✅ CLEAN INTENT DETECTED"

        );


        const operation =

            aiResponse.operation

            ||

            aiResponse.action;


        console.log(

            "CLEAN OPERATION:",

            operation

        );


        return editExecutor(

            workbook,

            {

                ...aiResponse,

                operation

            }

        );

    }


    //--------------------------------
    // NORMAL INTENTS
    //--------------------------------

    switch (

        aiResponse.intent

    ) {


        case "filter":

            return filterExecutor(

                workbook,

                aiResponse

            );


        case "sort":

            return sortExecutor(

                workbook,

                aiResponse

            );


        case "aggregate":

            return aggregateExecutor(

                workbook,

                aiResponse

            );


        case "chart":

            return chartExecutor(

                workbook,

                aiResponse

            );


        case "general":

            return {

                type: "message",

                message:

                    aiResponse.message

            };


        case "unknown":

            return {

                type: "message",

                message:

                    aiResponse.message

                    ||

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