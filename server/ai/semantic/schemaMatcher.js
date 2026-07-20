const COLUMN_SYNONYMS = {

    student: [
        "student",
        "learner",
        "candidate",
        "pupil"
    ],

    employee: [
        "employee",
        "staff",
        "worker",
        "personnel"
    ],

    patient: [
        "patient",
        "client",
        "resident"
    ],

    name: [
        "name",
        "full name",
        "employee name",
        "student name",
        "patient name"
    ],

    surname: [
        "surname",
        "last name",
        "family name"
    ],

    birthdate: [
        "birth date",
        "date of birth",
        "dob",
        "born"
    ],

    department: [
        "department",
        "division",
        "faculty"
    ],

    diagnosis: [
        "diagnosis",
        "disease",
        "illness",
        "condition"
    ],

    salary: [
        "salary",
        "income",
        "pay",
        "wage"
    ],

    revenue: [
        "revenue",
        "sales",
        "income"
    ],

    quantity: [
        "quantity",
        "qty",
        "units",
        "amount"
    ],

    gpa: [
        "gpa",
        "average",
        "average mark",
        "mark",
        "score"
    ]

};

function normalize(text) {

    return String(text || "")
        .toLowerCase()
        .trim();

}

function scoreColumn(columnName, userWord) {

    const column = normalize(columnName);

    const word = normalize(userWord);

    if (column === word) {

        return 100;

    }

    if (column.includes(word)) {

        return 90;

    }

    for (const values of Object.values(COLUMN_SYNONYMS)) {

        if (

            values.includes(column) &&
            values.includes(word)

        ) {

            return 80;

        }

    }

    return 0;

}

function findBestColumn(columns, userWord) {

    let bestColumn = null;

    let bestScore = -1;

    columns.forEach(column => {

        const score =
            scoreColumn(column, userWord);

        if (score > bestScore) {

            bestScore = score;

            bestColumn = column;

        }

    });

    return bestColumn;

}

module.exports = {

    findBestColumn

};