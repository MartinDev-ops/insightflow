function aggregateExecutor(workbook, aiResponse) {

    if (!workbook || !Array.isArray(workbook)) {

        return {

            type: "message",

            message: "No workbook loaded."

        };

    }

    const {

        sheet,

        operation,

        column,

        conditions = []

    } = aiResponse;

    const targetSheet =
        workbook.find(s => s.name === sheet) || workbook[0];

    if (!targetSheet || !targetSheet.rows?.length) {

        return {

            type: "message",

            message: "Sheet not found."

        };

    }

    const headerRow = targetSheet.rows[0];

    const headers = headerRow.cells.map(cell =>
        String(cell.value || "").trim()
    );

    let rows = targetSheet.rows.slice(1);

    // -----------------------
    // Apply Filters First
    // -----------------------

    conditions.forEach(condition => {

        const columnIndex =
            headers.indexOf(condition.column);

        if (columnIndex === -1) return;

        rows = rows.filter(row => {

            const value =
                String(row.cells[columnIndex]?.value ?? "")
                    .toLowerCase();

            return value.includes(
                String(condition.value).toLowerCase()
            );

        });

    });

    // -----------------------
    // COUNT
    // -----------------------

    if (operation === "count") {

        return {

            type: "metric",

            label: "Count",

            value: rows.length

        };

    }

    const valueColumn =
        headers.indexOf(column);

    if (valueColumn === -1) {

        return {

            type: "message",

            message: "Column not found."

        };

    }

    const numbers = rows
        .map(r => Number(r.cells[valueColumn]?.value))
        .filter(n => !isNaN(n));

    if (numbers.length === 0) {

        return {

            type: "message",

            message: "No numeric values."

        };

    }

    // -----------------------
    // SUM
    // -----------------------

    if (operation === "sum") {

        return {

            type: "metric",

            label: "Sum",

            value:
                numbers.reduce((a, b) => a + b, 0)

        };

    }

    // -----------------------
    // AVERAGE
    // -----------------------

    if (operation === "average") {

        return {

            type: "metric",

            label: "Average",

            value:
                numbers.reduce((a, b) => a + b, 0) /
                numbers.length

        };

    }

    // -----------------------
    // MAX
    // -----------------------

    if (operation === "max") {

        return {

            type: "metric",

            label: "Maximum",

            value: Math.max(...numbers)

        };

    }

    // -----------------------
    // MIN
    // -----------------------

    if (operation === "min") {

        return {

            type: "metric",

            label: "Minimum",

            value: Math.min(...numbers)

        };

    }

    return {

        type: "message",

        message: "Unknown aggregate operation."

    };

}

module.exports = aggregateExecutor;