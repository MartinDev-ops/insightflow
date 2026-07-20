function buildContext(workbook) {

    if (!workbook) {

        return {
            sheets: []
        };

    }

    const sheets = [];

    // -----------------------------
    // Univer Workbook
    // -----------------------------

    if (workbook.sheets) {

        Object.values(workbook.sheets).forEach(sheet => {

            const headers = [];

            const sampleRows = [];

            const firstRow = sheet.cellData?.[0];

            if (firstRow) {

                Object.keys(firstRow).forEach(col => {

                    headers.push(firstRow[col]?.v ?? "");

                });

            }

            for (let r = 1; r < 6; r++) {

                const row = sheet.cellData?.[r];

                if (!row) continue;

                const values = [];

                Object.keys(row).forEach(col => {

                    values.push(row[col]?.v);

                });

                sampleRows.push(values);

            }

            sheets.push({

                name: sheet.name,

                headers,

                sampleRows

            });

        });

    }

    // -----------------------------
    // Raw ExcelJS Workbook
    // -----------------------------

    else if (Array.isArray(workbook)) {

        workbook.forEach(sheet => {

            const headers =
                sheet.rows?.[0]?.cells?.map(c => c.value) || [];

            const sampleRows =
                sheet.rows
                    ?.slice(1, 6)
                    .map(row =>
                        row.cells.map(c => c.value)
                    ) || [];

            sheets.push({

                name: sheet.name,

                headers,

                sampleRows

            });

        });

    }

    return {

        sheets

    };

}

module.exports = {

    buildContext

};