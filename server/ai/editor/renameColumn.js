function renameColumn(workbook, aiResponse) {

    if (

        !workbook ||

        !Array.isArray(workbook)

    ) {

        return {

            success: false,

            message: "No workbook loaded."

        };

    }


    const targetSheet =

        workbook.find(

            sheet =>

                sheet.name === aiResponse.sheet

        )

        ||

        workbook[0];


    if (!targetSheet) {

        return {

            success: false,

            message: "Worksheet not found.",

            workbook

        };

    }


    if (

        !targetSheet.rows ||

        targetSheet.rows.length === 0

    ) {

        return {

            success: false,

            message: "Worksheet is empty.",

            workbook

        };

    }


    const headers =

        targetSheet.rows[0].cells;


    const oldName =

        String(

            aiResponse.oldName ||

            ""

        ).trim();


    const newName =

        String(

            aiResponse.newName ||

            ""

        ).trim();


    if (!oldName) {

        return {

            success: false,

            message:

                "Original column name is missing.",

            workbook

        };

    }


    if (!newName) {

        return {

            success: false,

            message:

                "New column name is missing.",

            workbook

        };

    }


    //--------------------------------
    // Find the original column
    //--------------------------------

    const index =

        headers.findIndex(

            cell =>

                String(

                    cell?.value ?? ""

                )

                    .trim()

                    .toLowerCase()

                ===

                oldName.toLowerCase()

        );


    if (

        index === -1

    ) {

        return {

            success: false,

            message:

                `Column '${oldName}' was not found.`,

            workbook

        };

    }


    //--------------------------------
    // Prevent duplicate column names
    //--------------------------------

    const duplicateName =

        headers.some(

            (cell, headerIndex) =>

                headerIndex !== index &&

                String(

                    cell?.value ?? ""

                )

                    .trim()

                    .toLowerCase()

                ===

                newName.toLowerCase()

        );


    if (

        duplicateName

    ) {

        return {

            success: false,

            message:

                `Column '${newName}' already exists.`,

            workbook

        };

    }


    //--------------------------------
    // Rename the column
    //--------------------------------

    headers[index].value =

        newName;


    return {

        success: true,

        type: "workbook",

        workbook,

        message:

            `Column '${oldName}' renamed to '${newName}'.`

    };

}


module.exports = renameColumn;