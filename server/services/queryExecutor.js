function executeQuery(workbook, query) {

    if (!workbook || !workbook.sheets) {

        return workbook;

    }

    // -------------------------
    // FILTER Department
    // -------------------------

    if (
        query.action === "filter" &&
        query.column === "Department"
    ) {

        Object.values(workbook.sheets).forEach(sheet => {

            const rows = sheet.cellData || {};

            const newRows = {};

            let newRowIndex = 0;

            // -------------------------
            // Find Department column
            // -------------------------

            const headerRow = rows[0];

            if (!headerRow) return;

            let departmentColumn = null;

            Object.entries(headerRow).forEach(([colIndex, cell]) => {

                if (
                    String(cell.v).trim().toLowerCase() ===
                    "department"
                ) {

                    departmentColumn = colIndex;

                }

            });

            if (departmentColumn === null) {

                return;

            }

            // Keep header

            newRows[newRowIndex++] = headerRow;

            // -------------------------
            // Filter rows
            // -------------------------

            Object.entries(rows).forEach(([rowIndex, row]) => {

                if (rowIndex === "0") return;

                const value =
                    String(
                        row[departmentColumn]?.v || ""
                    ).trim().toLowerCase();

                if (value === query.value.toLowerCase()) {

                    newRows[newRowIndex++] = row;

                }

            });

            sheet.cellData = newRows;

        });

    }

    return workbook;

}

module.exports = {

    executeQuery

};