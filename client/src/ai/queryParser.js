export function parseQuery(query) {

    const text = query.toLowerCase().trim();

    // -------------------------
    // Department
    // -------------------------

    const departmentMatch =
        text.match(/department\s+(?:of\s+)?([a-z]+)/i);

    if (departmentMatch) {

        return {

            action: "filter",
            column: "Department",
            operator: "=",
            value: departmentMatch[1]

        };

    }

    // -------------------------
    // Salary Between
    // -------------------------

    const salaryBetween =
        text.match(/between\s+(\d+)\s+and\s+(\d+)/i);

    if (salaryBetween) {

        return {

            action: "between",
            column: "Salary",
            min: Number(salaryBetween[1]),
            max: Number(salaryBetween[2])

        };

    }

    return {

        action: "unknown"

    };

}