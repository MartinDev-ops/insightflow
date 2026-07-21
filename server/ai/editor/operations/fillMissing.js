function fillMissing(workbook, aiResponse) {

    const {

        sheet,

        column,

        value

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
        targetSheet.rows[0].cells.map(cell =>
            String(cell.value || "").trim()
        );

    const columnIndex =
        headers.indexOf(column);

    if (columnIndex === -1) {

        return {

            success: false,

            message:
                `Column "${column}" was not found.`,

            workbook

        };

    }

    let filled = 0;

    targetSheet.rows
        .slice(1)
        .forEach(row => {

            const cell =
                row.cells[columnIndex];

            if (

                !cell ||

                cell.value === null ||

                cell.value === undefined ||

                String(cell.value).trim() === ""

            ) {

                if (!row.cells[columnIndex]) {

                    row.cells[columnIndex] = {

                        value

                    };

                }

                else {

                    row.cells[columnIndex].value =
                        value;

                }

                filled++;

            }

        });

    return {

        success: true,

        type: "workbook",

        message:
            `Filled ${filled} missing values in "${column}".`,

        workbook

    };

}

module.exports = fillMissing;