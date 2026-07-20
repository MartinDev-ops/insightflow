export default function applyAIResult(

    univerAPI,

    result

) {

    if (!univerAPI) return;

    if (!result) return;

    console.log("Applying AI Result");

    console.log(result);

    switch (result.type) {

        case "table":

            console.log("Render filtered table");

            break;

        case "sort":

            console.log("Render sorted table");

            break;

        case "aggregate":

            console.log("Show aggregate");

            break;

        case "chart":

            console.log("Render chart");

            break;

        case "message":

            console.log(result.message);

            break;

        case "workbook":

            console.log("Replace workbook");

            break;

        default:

            console.log("Unknown result");

    }

}