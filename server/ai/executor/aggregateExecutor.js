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

function formatNumber(value) {

    return new Intl.NumberFormat("en-ZA", {

        maximumFractionDigits: 2

    }).format(value);

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

    const rawFunction = aiResponse.function;

    const fn = normalizeFunction(rawFunction);

    const targetSheet =

        workbook.find(s => s.name === sheet)

        ||

        workbook[0];

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

                String(

                    row.cells[columnIndex]?.value ?? ""

                ).toLowerCase();

            return value.includes(

                String(condition.value)

                    .toLowerCase()

            );

        });

    });

    // -----------------------
    // COUNT
    // -----------------------

    if (fn === "count") {

        const value = rows.length;

        return {

            type: "metric",

            label: "Count",

            value,

            message:

                `There are ${formatNumber(value)} ` +

                `matching record${value === 1 ? "" : "s"}.`

        };

    }

    if (!fn) {

        return {

            type: "message",

            message:

                `Unknown aggregate function: "${rawFunction}".`

        };

    }

    const valueColumn =

        headers.indexOf(column);

    if (valueColumn === -1) {

        return {

            type: "message",

            message:

                `I could not find the column "${column}".`

        };

    }

    const numbers = rows

        .map(row =>

            Number(

                row.cells[valueColumn]?.value

            )

        )

        .filter(number => !isNaN(number));

    if (numbers.length === 0) {

        return {

            type: "message",

            message:

                `There are no numeric values in the "${column}" column.`

        };

    }

    // -----------------------
    // SUM
    // -----------------------

    if (fn === "sum") {

        const value =

            numbers.reduce(

                (a, b) => a + b,

                0

            );

        return {

            type: "metric",

            label: "Sum",

            value,

            message:

                `The total ${column} is ${formatNumber(value)}.`

        };

    }

    // -----------------------
    // AVERAGE
    // -----------------------

    if (fn === "average") {

        const value =

            numbers.reduce(

                (a, b) => a + b,

                0

            ) /

            numbers.length;

        return {

            type: "metric",

            label: "Average",

            value,

            message:

                `The average ${column} is ${formatNumber(value)}.`

        };

    }

    // -----------------------
    // MAX
    // -----------------------

    if (fn === "max") {

        const value = Math.max(...numbers);

        return {

            type: "metric",

            label: "Maximum",

            value,

            message:

                `The highest ${column} is ${formatNumber(value)}.`

        };

    }

    // -----------------------
    // MIN
    // -----------------------

    if (fn === "min") {

        const value = Math.min(...numbers);

        return {

            type: "metric",

            label: "Minimum",

            value,

            message:

                `The lowest ${column} is ${formatNumber(value)}.`

        };

    }

    return {

        type: "message",

        message:

            "Unknown aggregate function."

    };

}

module.exports = aggregateExecutor;