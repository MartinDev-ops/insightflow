function renameColumn(workbook, aiResponse) {

    const {

        sheet,

        oldName,

        newName

    } = aiResponse;

    const targetSheet =
        workbook.find(s => s.name === sheet)
        || workbook[0];

    if (!targetSheet || !targetSheet.rows?.length) {

        return {

            success: false,

            message: "Sheet not found.",

            workbook

        };

    }

    const headers =
        targetSheet.rows[0].cells;

    const column =
        headers.find(cell =>

            String(cell.value)
                .trim()
                .toLowerCase() ===
            String(oldName)
                .trim()
                .toLowerCase()

        );

    if (!column) {

        return {

            success: false,

            message:
                `Column "${oldName}" was not found.`,

            workbook

        };

    }

    column.value = newName;

    return {

        success: true,

        type: "workbook",

        message:
            `Column renamed from "${oldName}" to "${newName}".`,

        workbook

    };

}

module.exports = renameColumn;