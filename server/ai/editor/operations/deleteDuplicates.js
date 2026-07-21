function deleteDuplicates(workbook, aiResponse) {

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

    const header =
        targetSheet.rows[0];

    const rows =
        targetSheet.rows.slice(1);

    const seen = new Set();

    const uniqueRows = [];

    let removed = 0;

    rows.forEach(row => {

        const rowKey =
            row.cells
                .map(cell =>
                    String(cell.value ?? "")
                        .trim()
                        .toLowerCase()
                )
                .join("|");

        if (seen.has(rowKey)) {

            removed++;

        }

        else {

            seen.add(rowKey);

            uniqueRows.push(row);

        }

    });

    targetSheet.rows = [

        header,

        ...uniqueRows

    ];

    return {

        success: true,

        type: "workbook",

        message:
            `Removed ${removed} duplicate rows.`,

        workbook

    };

}

module.exports = deleteDuplicates;