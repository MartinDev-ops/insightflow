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


    //--------------------------------
    // Read header row
    //--------------------------------

    const headerCells =

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

                "The original column name is missing.",

            workbook

        };

    }


    if (!newName) {

        return {

            success: false,

            message:

                "The new column name is missing.",

            workbook

        };

    }


    //--------------------------------
    // Find original column
    //--------------------------------

    const columnIndex =

        headerCells.findIndex(

            cell =>

                String(

                    cell?.value ?? ""

                )

                    .trim()

                    .toLowerCase()

                ===

                oldName

                    .toLowerCase()

        );


    if (

        columnIndex === -1

    ) {

        return {

            success: false,

            message:

                `Column '${oldName}' was not found.`,

            workbook

        };

    }


    //--------------------------------
    // Check duplicate new name
    //--------------------------------

    const newNameExists =

        headerCells.some(

            (cell, index) =>

                index !== columnIndex &&

                String(

                    cell?.value ?? ""

                )

                    .trim()

                    .toLowerCase()

                ===

                newName

                    .toLowerCase()

        );


    if (

        newNameExists

    ) {

        return {

            success: false,

            message:

                `Column '${newName}' already exists.`,

            workbook

        };

    }


    //--------------------------------
    // Rename column
    //--------------------------------

    headerCells[

        columnIndex

    ].value = newName;


    return {

        success: true,

        type: "workbook",

        workbook,

        message:

            `Column '${oldName}' renamed to '${newName}'.`

    };

}


module.exports = renameColumn;