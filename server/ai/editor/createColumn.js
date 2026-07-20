const {
    inferColumn
} = require("../inference/inferenceEngine");

function createColumn(workbook, aiResponse) {

    if (!workbook || !Array.isArray(workbook)) {

        return {

            success: false,

            message: "No workbook loaded."

        };

    }

    const targetSheet =
        workbook.find(sheet => sheet.name === aiResponse.sheet)
        || workbook[0];

    if (!targetSheet) {

        return {

            success: false,

            message: "Worksheet not found."

        };

    }

    if (!targetSheet.rows?.length) {

        return {

            success: false,

            message: "Worksheet is empty."

        };

    }

    //--------------------------------------------------
    // Read existing headers
    //--------------------------------------------------

    const headerCells =
        targetSheet.rows[0].cells;

    const headers =
        headerCells.map(cell =>
            String(cell.value || "")
        );

    //--------------------------------------------------
    // Prevent duplicate columns
    //--------------------------------------------------

    if (

        headers.includes(aiResponse.column)

    ) {

        return {

            success: false,

            message:
                `Column '${aiResponse.column}' already exists.`

        };

    }

    //--------------------------------------------------
    // Create Header
    //--------------------------------------------------

    headerCells.push({

        value: aiResponse.column

    });

    //--------------------------------------------------
    // Populate every row
    //--------------------------------------------------

    targetSheet.rows
        .slice(1)
        .forEach(row => {

            const rowObject = {};

            headers.forEach((header, index) => {

                rowObject[header] =
                    row.cells[index]?.value;

            });

            let value = "";

            //--------------------------------------------------
            // Calculated Column
            //--------------------------------------------------

            if (aiResponse.sourceColumn) {

                value =
                    inferColumn(

                        aiResponse.column,

                        rowObject

                    );

            }

            row.cells.push({

                value

            });

        });

    return {

        success: true,

        type: "workbook",

        workbook,

        message:
            `Column '${aiResponse.column}' created successfully.`

    };

}

module.exports = createColumn;