function normalize(value) {

    if (value === null || value === undefined) {

        return "";

    }

    return value;

}

function sortExecutor(workbook, aiResponse) {

    if (!workbook || !Array.isArray(workbook)) {

        return {

            type: "table",

            rows: []

        };

    }

    const {

        sheet,

        column,

        direction = "asc"

    } = aiResponse;

    const targetSheet =
        workbook.find(s => s.name === sheet) || workbook[0];

    if (!targetSheet || !targetSheet.rows?.length) {

        return {

            type: "table",

            rows: []

        };

    }

    const headerRow = targetSheet.rows[0];

    const headers = headerRow.cells.map(cell =>
        String(cell.value || "").trim()
    );

    const columnIndex = headers.indexOf(column);

    if (columnIndex === -1) {

        return {

            type: "message",

            message: `Column "${column}" not found.`

        };

    }

    const rows = [...targetSheet.rows.slice(1)];

    rows.sort((a, b) => {

        const valueA =
            normalize(a.cells[columnIndex]?.value);

        const valueB =
            normalize(b.cells[columnIndex]?.value);

        if (valueA < valueB) {

            return direction === "asc" ? -1 : 1;

        }

        if (valueA > valueB) {

            return direction === "asc" ? 1 : -1;

        }

        return 0;

    });

    return {

        type: "table",

        headers,

        rows

    };

}

module.exports = sortExecutor;