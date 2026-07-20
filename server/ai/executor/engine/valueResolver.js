const {

    inferColumn,
    canInfer

} = require("../../inference/inferenceEngine");

function valueResolver(

    row,

    headers,

    requestedColumn

) {

    const columnIndex =
        headers.indexOf(requestedColumn);

    if (columnIndex !== -1) {

        return row.cells[columnIndex]?.value;

    }

    if (canInfer(requestedColumn)) {

        const rowObject = {};

        headers.forEach((header, index) => {

            rowObject[header] =
                row.cells[index]?.value;

        });

        return inferColumn(

            requestedColumn,

            rowObject

        );

    }

    return undefined;

}

module.exports = valueResolver;