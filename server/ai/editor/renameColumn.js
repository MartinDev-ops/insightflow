function renameColumn(workbook, aiResponse) {

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

    if (!targetSheet.rows || targetSheet.rows.length === 0) {

        return {

            success: false,

            message: "Worksheet is empty."

        };

    }

    const headers =
        targetSheet.rows[0].cells;

    const index =
        headers.findIndex(cell =>

            String(cell.value || "").trim() ===
            aiResponse.oldName

        );

    if (index === -1) {

        return {

            success: false,

            message:
                `Column '${aiResponse.oldName}' was not found.`

        };

    }

    headers[index].value =
        aiResponse.newName;

    return {

        success: true,

        type: "workbook",

        workbook,

        message:
            `Column '${aiResponse.oldName}' renamed to '${aiResponse.newName}'.`

    };

}

module.exports = renameColumn;