function findColumnIndex(headers, requestedColumn) {

    const normalizedColumn = String(requestedColumn || "")
        .trim()
        .toLowerCase();

    return headers.findIndex(header =>

        header.toLowerCase() === normalizedColumn

    );

}

function toNumber(value) {

    if (typeof value === "number") return value;

    if (typeof value !== "string") return NaN;

    return Number(

        value
            .trim()
            .replace(/,/g, "")
            .replace(/[^0-9.-]/g, "")

    );

}

function formatNumber(value) {

    return new Intl.NumberFormat("en-ZA", {

        maximumFractionDigits: 2

    }).format(value);

}

function chartExecutor(workbook, aiResponse) {

    if (!Array.isArray(workbook) || workbook.length === 0) {

        return {

            type: "message",
            message: "No workbook loaded."

        };

    }

    const targetSheet =

        workbook.find(sheet => sheet.name === aiResponse.sheet)

        || workbook[0];

    if (!targetSheet?.rows?.length) {

        return {

            type: "message",
            message: "Sheet not found or contains no data."

        };

    }

    const headers = targetSheet.rows[0].cells.map(cell =>

        String(cell.value ?? "").trim()

    );

    const groupByIndex = findColumnIndex(headers, aiResponse.groupBy);

    if (groupByIndex === -1) {

        return {

            type: "message",
            message: `I could not find the column "${aiResponse.groupBy}".`

        };

    }

    const hasValueColumn = Boolean(String(aiResponse.valueColumn || "").trim());
    const valueColumnIndex = hasValueColumn

        ? findColumnIndex(headers, aiResponse.valueColumn)
        : -1;

    if (hasValueColumn && valueColumnIndex === -1) {

        return {

            type: "message",
            message: `I could not find the column "${aiResponse.valueColumn}".`

        };

    }

    const groups = new Map();

    for (const row of targetSheet.rows.slice(1)) {

        const label = String(row.cells[groupByIndex]?.value ?? "").trim() || "(blank)";
        const currentValue = groups.get(label) || 0;

        if (hasValueColumn) {

            const value = toNumber(row.cells[valueColumnIndex]?.value);

            if (Number.isNaN(value)) continue;

            groups.set(label, currentValue + value);

        } else {

            groups.set(label, currentValue + 1);

        }

    }

    if (groups.size === 0) {

        return {

            type: "message",
            message: hasValueColumn
                ? `There are no numeric values in the "${aiResponse.valueColumn}" column.`
                : "There are no records to chart."

        };

    }

    const labels = [...groups.keys()];
    const values = [...groups.values()];
    const measure = hasValueColumn ? aiResponse.valueColumn : "Count";
    const summary = labels.map((label, index) =>

        `${label}: ${formatNumber(values[index])}`

    ).join(", ");

    return {

        type: "chart",
        message: `${measure} by ${headers[groupByIndex]} — ${summary}.`,
        chart: {

            type: aiResponse.chartType,
            labels,
            datasets: [{

                label: `${measure} by ${headers[groupByIndex]}`,
                data: values

            }]

        }

    };

}

module.exports = chartExecutor;
