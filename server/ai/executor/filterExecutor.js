const compare = require("./engine/comparisonEngine");
const resolveRowValue = require("./engine/rowResolver");

function filterExecutor(workbook, aiResponse) {

    if (!workbook || !Array.isArray(workbook)) {

        return {

            type: "table",

            headers: [],

            rows: []

        };

    }

    const {

        sheet,

        conditions = []

    } = aiResponse;

    const targetSheet =

        workbook.find(s => s.name === sheet)

        ||

        workbook[0];

    if (

        !targetSheet ||

        !targetSheet.rows ||

        targetSheet.rows.length === 0

    ) {

        return {

            type: "table",

            headers: [],

            rows: []

        };

    }

    const headerRow = targetSheet.rows[0];

    const headers =

        headerRow.cells.map(cell =>

            String(cell.value || "").trim()

        );

    const matchedRows = [];

    for (const row of targetSheet.rows.slice(1)) {

        let keep = true;

        for (const condition of conditions) {

            const value = resolveRowValue(

                row,

                headers,

                condition.column

            );

            if (

                value === undefined ||

                value === null

            ) {

                keep = false;

                break;

            }

            const passed = compare(

                value,

                condition.operator,

                condition.value

            );

            if (!passed) {

                keep = false;

                break;

            }

        }

        if (keep) {

            matchedRows.push(row);

        }

    }

    return {

        type: "table",

        headers,

        rows: matchedRows

    };

}

module.exports = filterExecutor;