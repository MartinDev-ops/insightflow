function calculateAge(date) {

    const dob = new Date(date);

    if (isNaN(dob)) return null;

    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const month =
        today.getMonth() - dob.getMonth();

    if (

        month < 0 ||

        (
            month === 0 &&
            today.getDate() < dob.getDate()
        )

    ) {

        age--;

    }

    return age;

}

function calculateBirthYear(date) {

    const dob = new Date(date);

    if (isNaN(dob)) return null;

    return dob.getFullYear();

}

function calculateYearsWorked(date) {

    const hire = new Date(date);

    if (isNaN(hire)) return null;

    const today = new Date();

    return today.getFullYear() - hire.getFullYear();

}

function calculateProfit(revenue, cost) {

    return Number(revenue || 0) - Number(cost || 0);

}

function calculateFullName(first, last) {

    return `${first || ""} ${last || ""}`.trim();

}

module.exports = {

    calculateAge,

    calculateBirthYear,

    calculateYearsWorked,

    calculateProfit,

    calculateFullName

};