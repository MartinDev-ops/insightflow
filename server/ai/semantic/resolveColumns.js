const { findBestColumn } = require("./schemaMatcher");

function resolveColumns(workbook, aiResponse) {

    if (!workbook || !Array.isArray(workbook)) {

        return aiResponse;

    }

    const targetSheet =
        workbook.find(sheet => sheet.name === aiResponse.sheet)
        || workbook[0];

    if (!targetSheet) {

        return aiResponse;

    }

    if (!targetSheet.rows || targetSheet.rows.length === 0) {

        return aiResponse;

    }

    const headers =
        targetSheet.rows[0].cells.map(cell =>
            String(cell.value || "")
        );

    // -----------------------------
    // Resolve Aggregate Column
    // -----------------------------

    if (aiResponse.column) {

        aiResponse.column =
            findBestColumn(
                headers,
                aiResponse.column
            );

    }

    // -----------------------------
    // Resolve Filter Columns
    // -----------------------------

    if (Array.isArray(aiResponse.conditions)) {

        aiResponse.conditions =
            aiResponse.conditions.map(condition => ({

                ...condition,

                column:
                    findBestColumn(
                        headers,
                        condition.column
                    )

            }));

    }

    return aiResponse;

}

module.exports = {

    resolveColumns

};