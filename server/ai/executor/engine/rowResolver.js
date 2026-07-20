const valueResolver = require("./valueResolver");

function resolveRowValue(row, headers, columnName) {

    return valueResolver(

        row,

        headers,

        columnName

    );

}

module.exports = resolveRowValue;