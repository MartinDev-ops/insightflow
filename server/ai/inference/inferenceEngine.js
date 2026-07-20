const VIRTUAL_COLUMNS = require("./virtualColumns");

const {

    calculateAge,
    calculateBirthYear,
    calculateYearsWorked,
    calculateProfit,
    calculateFullName

} = require("./calculators");

function inferColumn(columnName, row) {

    const name = String(columnName || "")
        .toLowerCase()
        .trim();

    // -----------------------------
    // AGE
    // -----------------------------

    if (name === "age") {

        const dob =
            row["DOB"] ||
            row["Birth Date"] ||
            row["Date of Birth"];

        if (!dob) return null;

        return calculateAge(dob);

    }

    // -----------------------------
    // BIRTH YEAR
    // -----------------------------

    if (

        name === "birth year" ||
        name === "birthyear"

    ) {

        const dob =
            row["DOB"] ||
            row["Birth Date"] ||
            row["Date of Birth"];

        if (!dob) return null;

        return calculateBirthYear(dob);

    }

    // -----------------------------
    // YEARS WORKED
    // -----------------------------

    if (

        name === "years worked"

    ) {

        const hireDate =
            row["Hire Date"] ||
            row["Employment Date"] ||
            row["Start Date"];

        if (!hireDate) return null;

        return calculateYearsWorked(hireDate);

    }

    // -----------------------------
    // FULL NAME
    // -----------------------------

    if (

        name === "full name"

    ) {

        return calculateFullName(

            row["First Name"] || row["Name"],

            row["Last Name"] || row["Surname"]

        );

    }

    // -----------------------------
    // PROFIT
    // -----------------------------

    if (

        name === "profit"

    ) {

        return calculateProfit(

            row["Revenue"] || row["Sales"],

            row["Cost"] || row["Expenses"]

        );

    }

    return null;

}

function canInfer(columnName) {

    const name =
        String(columnName)
            .toLowerCase()
            .replace(/\s/g, "");

    return Object.keys(VIRTUAL_COLUMNS)

        .some(key =>

            key
                .toLowerCase()
                .replace(/\s/g, "") === name

        );

}

module.exports = {

    inferColumn,

    canInfer

};