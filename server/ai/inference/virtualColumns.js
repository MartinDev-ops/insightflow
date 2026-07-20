const VIRTUAL_COLUMNS = {

    age: {
        requires: ["DOB", "Birth Date", "Date of Birth"]
    },

    birthYear: {
        requires: ["DOB", "Birth Date", "Date of Birth"]
    },

    fullName: {
        requires: [
            ["First Name", "Last Name"],
            ["Name", "Surname"]
        ]
    },

    yearsWorked: {
        requires: [
            "Hire Date",
            "Employment Date",
            "Start Date"
        ]
    },

    profit: {
        requires: [
            ["Revenue", "Cost"],
            ["Sales", "Expenses"]
        ]
    }

};

module.exports = VIRTUAL_COLUMNS;