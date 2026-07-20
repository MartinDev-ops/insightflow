function detectSchema(workbook) {

    if (!workbook || !Array.isArray(workbook)) {

        return {

            sheets: [],
            entities: [],
            columns: [],
            examples: {}

        };

    }

    const schema = {

        sheets: [],
        entities: [],
        columns: [],
        examples: {}

    };

    workbook.forEach(sheet => {

        schema.sheets.push(sheet.name);

        if (!sheet.rows || sheet.rows.length === 0) {

            return;

        }

        const headerRow = sheet.rows[0];

        if (!headerRow.cells) {

            return;

        }

        headerRow.cells.forEach(cell => {

            if (!cell) return;

            const value = String(cell.value || "").trim();

            if (!value) return;

            schema.columns.push(value);

            schema.examples[value] = [];

        });

        const sampleRows = sheet.rows.slice(1, 6);

        sampleRows.forEach(row => {

            row.cells.forEach((cell, index) => {

                const column = schema.columns[index];

                if (!column) return;

                schema.examples[column].push(cell?.value);

            });

        });

    });

    const joined = schema.columns.join(" ").toLowerCase();

    if (
        joined.includes("student") ||
        joined.includes("enrol") ||
        joined.includes("course")
    ) {

        schema.entities.push("students");

    }

    if (
        joined.includes("employee") ||
        joined.includes("salary") ||
        joined.includes("department")
    ) {

        schema.entities.push("employees");

    }

    if (
        joined.includes("patient") ||
        joined.includes("diagnosis") ||
        joined.includes("disease")
    ) {

        schema.entities.push("patients");

    }

    if (
        joined.includes("product") ||
        joined.includes("price") ||
        joined.includes("stock")
    ) {

        schema.entities.push("products");

    }

    return schema;

}

module.exports = {

    detectSchema

};