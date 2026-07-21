function normalizeValue(cell) {

    return cell &&
        cell.value !== undefined &&
        cell.value !== null

        ? cell.value

        : "";

}

function detectColumnType(values) {

    const nonEmpty = values

        .map(value => String(value).trim())

        .filter(value => value !== "");

    if (nonEmpty.length === 0) {

        return "string";

    }

    const allNumbers = nonEmpty.every(

        value => !isNaN(Number(value))

    );

    if (allNumbers) {

        return "number";

    }

    const allDates = nonEmpty.every(value => {

        const date = new Date(value);

        return (

            !isNaN(date.getTime()) &&

            /\d{4}/.test(value)

        );

    });

    if (allDates) {

        return "date";

    }

    return "string";

}

function detectSheetSchema(sheet) {

    if (

        !sheet ||

        !sheet.rows ||

        sheet.rows.length === 0

    ) {

        return {

            sheet: sheet

                ? sheet.name

                : null,

            columns: [],

            rowCount: 0

        };

    }

    const headerRow = sheet.rows[0];

    const headers =

        headerRow.cells.map(cell =>

            String(

                normalizeValue(cell)

            ).trim()

        );

    const dataRows =

        sheet.rows.slice(1);

    const columns =

        headers.map((header, columnIndex) => {

            const columnValues =

                dataRows.map(row =>

                    normalizeValue(

                        row.cells[columnIndex]

                    )

                );

            return {

                name: header,

                type: detectColumnType(

                    columnValues

                )

            };

        });

    return {

        sheet: sheet.name,

        columns,

        rowCount: dataRows.length

    };

}

function detectSchema(workbook) {

    if (

        !workbook ||

        !Array.isArray(workbook)

    ) {

        return [];

    }

    return workbook.map(sheet =>

        detectSheetSchema(sheet)

    );

}

module.exports = {

    detectSchema

};