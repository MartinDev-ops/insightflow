const { detectSchema } = require("./schemaDetector");

function buildWorkbookContext(workbook) {

    const schema =
        detectSchema(workbook);

    return {

        sheetCount: schema.length,

        sheets: schema.map(sheetSchema => ({

            name: sheetSchema.sheet,

            rowCount: sheetSchema.rowCount,

            columns: sheetSchema.columns.map(col => ({

                name: col.name,

                type: col.type

            }))

        }))

    };

}

module.exports = {

    buildWorkbookContext

};