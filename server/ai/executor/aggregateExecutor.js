// Maps common natural-language phrasings to the exact function values
// this executor knows how to run. The prompt already instructs Gemini to
// use exactly "sum" | "average" | "count" | "min" | "max", so this is a
// safety net for the rare case it doesn't, not the primary defense.
const FUNCTION_ALIASES = {

    sum: "sum",
    total: "sum",
    totalsum: "sum",

    average: "average",
    avg: "average",
    mean: "average",

    count: "count",
    total_count: "count",
    number: "count",

    max: "max",
    maximum: "max",
    highest: "max",

    min: "min",
    minimum: "min",
    lowest: "min"

};

function normalizeFunction(rawFunction) {

    if (!rawFunction) return null;

    const key = String(rawFunction)
        .toLowerCase()
        .replace(/[^a-z]/g, "");

    return FUNCTION_ALIASES[key] || null;

}

function aggregateExecutor(workbook, aiResponse) {

    if (!workbook || !Array.isArray(workbook)) {

        return {

            type: "message",

            message: "No workbook loaded."

        };

    }

    const {

        sheet,
        column,
        conditions = []

    } = aiResponse;

    // "function" is a reserved word, so it can't be destructured directly -
    // this is the field the prompt actually tells Gemini to use.
    const rawFunction = aiResponse.function;

    const fn = normalizeFunction(rawFunction);

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

    if (fn === "count") {

        return {

            type: "metric",

            label: "Count",

            value: rows.length

        };

    }

    if (!fn) {

        return {

            type: "message",

            message: `Unknown aggregate function: "${rawFunction}".`

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

    if (fn === "sum") {

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

    if (fn === "average") {

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

    if (fn === "max") {

        return {

            type: "metric",

            label: "Maximum",

            value: Math.max(...numbers)

        };

    }

    // -----------------------
    // MIN
    // -----------------------

    if (fn === "min") {

        return {

            type: "metric",

            label: "Minimum",

            value: Math.min(...numbers)

        };

    }

    return {

        type: "message",

        message: "Unknown aggregate function."

    };

}

module.exports = aggregateExecutor;