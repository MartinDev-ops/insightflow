function trimWhitespace(workbook, aiResponse) {

    const {

        sheet

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

    let trimmed = 0;

    targetSheet.rows.forEach(row => {

        row.cells.forEach(cell => {

            if (typeof cell.value === "string") {

                const original =
                    cell.value;

                const cleaned =
                    cell.value.trim();

                if (original !== cleaned) {

                    cell.value = cleaned;

                    trimmed++;

                }

            }

        });

    });

    return {

        success: true,

        type: "workbook",

        message:
            `Trimmed whitespace from ${trimmed} cells.`,

        workbook

    };

}

module.exports = trimWhitespace;