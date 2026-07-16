function cleanWorkbookData(workbook) {

    let duplicates = 0;
    let emptyCells = 0;
    let trimmed = 0;
    let phoneNumbers = 0;
    let dates = 0;

    Object.values(workbook.sheets || {}).forEach(sheet => {

        const seenRows = new Set();

        const originalRows = sheet.cellData || {};
        const newCellData = {};

        let newRowIndex = 0;

        Object.keys(originalRows).forEach(rowIndex => {

            const row = originalRows[rowIndex];

            const values = Object.values(row || {}).map(cell =>
                String(cell?.v ?? "").trim()
            );

            // Ignore completely empty rows
            if (values.every(v => v === "")) {
                return;
            }

            const rowKey = JSON.stringify(values);

            // -------------------------
            // Duplicate Detection
            // -------------------------

            if (seenRows.has(rowKey)) {

                duplicates++;
                return;

            }

            seenRows.add(rowKey);

            // -------------------------
            // Cell Cleaning
            // -------------------------

            Object.values(row || {}).forEach(cell => {

                if (
                    cell.v === "" ||
                    cell.v === null ||
                    cell.v === undefined
                ) {

                    emptyCells++;
                    return;

                }

                if (typeof cell.v !== "string") {
                    return;
                }

                // Remove extra spaces

                const oldValue = cell.v;

                cell.v = cell.v.trim();

                if (oldValue !== cell.v) {

                    trimmed++;

                }

                // -------------------------
                // Phone Numbers
                // -------------------------

                const digits = cell.v.replace(/\D/g, "");

                if (digits.length === 10) {

                    cell.v = digits;
                    phoneNumbers++;

                }

                // -------------------------
                // Dates
                // -------------------------

                if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cell.v)) {

                    const [d, m, y] = cell.v.split("/");

                    cell.v =
                        `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;

                    dates++;

                }

            });

            // -------------------------
            // Keep the row
            // -------------------------

            newCellData[newRowIndex] = row;

            newRowIndex++;

        });

        // Replace only the row data
        sheet.cellData = newCellData;

        // IMPORTANT:
        // Keep the original spreadsheet size.
        // DO NOT change sheet.rowCount.

    });

    return {

        workbook,

        summary: {

            duplicates,
            emptyCells,
            phoneNumbers,
            dates,
            trimmed

        }

    };

}

module.exports = {

    cleanWorkbookData

};