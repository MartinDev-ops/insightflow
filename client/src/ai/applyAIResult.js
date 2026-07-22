export default function applyAIResult(

    univerAPI,

    result

) {

    if (!result) {

        console.log(

            "No AI result received."

        );

        return;

    }

    console.log(

        "Applying AI Result"

    );

    console.log(result);


    switch (result.type) {


        case "message":

            console.log(

                result.message

            );

            break;


        case "metric":

            console.log(

                `${result.label}: ${result.value}`

            );

            break;


        case "table":

            renderTableResult(

                univerAPI,

                result

            );

            break;


        case "sort":

            renderTableResult(

                univerAPI,

                result

            );

            break;


        case "chart":

            console.log(

                "Chart result received:",

                result

            );

            break;


        case "workbook":

            console.log(

                "Workbook result received:",

                result

            );

            break;


        default:

            console.log(

                "Unknown result type:",

                result.type

            );

    }

}


function renderTableResult(

    univerAPI,

    result

) {


    if (!univerAPI) {

        console.error(

            "Univer API is not available."

        );

        return;

    }


    const workbook =

        univerAPI.getActiveWorkbook();


    if (!workbook) {

        console.error(

            "No active workbook."

        );

        return;

    }


    const worksheet =

        workbook.getActiveSheet();


    if (!worksheet) {

        console.error(

            "No active worksheet."

        );

        return;

    }


    const headers =

        result.headers || [];


    const rows =

        result.rows || [];


    console.log(

        `Rendering ${rows.length} rows`

    );


    //--------------------------------
    // Calculate required dimensions
    //--------------------------------


    const columnCount =

        Math.max(

            headers.length,

            1

        );


    const resultRowCount =

        rows.length + 1;


    //--------------------------------
    // Clear a safe area
    //--------------------------------
    // Univer has a maximum of 100 rows
    // in the current sheet configuration.
    //
    // We clear only the area we need
    // plus a buffer.


    const clearRowCount =

        Math.min(

            Math.max(

                resultRowCount + 20,

                20

            ),

            100

        );


    const clearRange =

        worksheet.getRange(

            0,

            0,

            clearRowCount,

            columnCount

        );


    clearRange.clear({

        contents: true

    });


    //--------------------------------
    // Write headers
    //--------------------------------


    headers.forEach(

        (

            header,

            columnIndex

        ) => {


            worksheet

                .getRange(

                    0,

                    columnIndex

                )

                .setValue(

                    header

                );

        }

    );


    //--------------------------------
    // Write rows
    //--------------------------------


    rows.forEach(

        (

            row,

            rowIndex

        ) => {


            const actualRow =

                rowIndex + 1;


            const cells =

                row.cells || [];


            cells.forEach(

                (

                    cell,

                    columnIndex

                ) => {


                    worksheet

                        .getRange(

                            actualRow,

                            columnIndex

                        )

                        .setValue(

                            cell?.value ?? ""

                        );

                }

            );

        }

    );


    console.log(

        "✅ Table result rendered."

    );

}