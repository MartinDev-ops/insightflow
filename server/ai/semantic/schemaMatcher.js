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
        "patient name",
        "first name"
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
        "faculty",
        "dept",
        "team"
    ],

    diagnosis: [
        "diagnosis",
        "disease",
        "illness",
        "condition",
        "medical condition"
    ],

    salary: [
        "salary",
        "income",
        "pay",
        "wage",
        "compensation"
    ],

    revenue: [
        "revenue",
        "sales",
        "income"
    ],

    cost: [
        "cost",
        "expenses",
        "expense"
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
    ],

    email: [
        "email",
        "email address",
        "e-mail"
    ],

    phone: [
        "phone",
        "phone number",
        "contact number",
        "mobile"
    ],

    address: [
        "address",
        "home address",
        "location"
    ],

    date: [
        "date",
        "admission date",
        "hire date",
        "start date"
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

    return bestScore > 0 ? bestColumn : null;

}

module.exports = {

    findBestColumn

};