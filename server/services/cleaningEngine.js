function cleanWorkbookData(workbook) {

    let duplicates = 0;
    let emptyCells = 0;
    let trimmed = 0;
    let phoneNumbers = 0;
    let dates = 0;

    Object.values(workbook.sheets || {}).forEach(sheet => {

        const seenRows = new Set();

        Object.keys(sheet.cellData || {}).forEach(rowIndex => {

            const row = sheet.cellData[rowIndex];

            const values = Object.values(row || {}).map(cell =>
                String(cell?.v ?? "").trim()
            );

            const rowKey = JSON.stringify(values);

            if (seenRows.has(rowKey)) {

                duplicates++;

                // Keep the row but clear its cells
                Object.keys(row).forEach(col => {

                    row[col] = {
                        v: ""
                    };

                });

                return;

            }

            seenRows.add(rowKey);

            Object.values(row || {}).forEach(cell => {

                if (
                    cell.v === "" ||
                    cell.v === null ||
                    cell.v === undefined
                ) {

                    emptyCells++;
                    return;

                }

                if (typeof cell.v === "string") {

                    const oldValue = cell.v;

                    cell.v = cell.v.trim();

                    if (oldValue !== cell.v) {

                        trimmed++;

                    }

                    const digits = cell.v.replace(/\D/g, "");

                    if (digits.length === 10) {

                        cell.v = digits;

                        phoneNumbers++;

                    }

                    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cell.v)) {

                        const [d, m, y] = cell.v.split("/");

                        cell.v =
                            `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;

                        dates++;

                    }

                }

            });

        });

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