function normalize(value) {

    if (value === null || value === undefined) {

        return "";

    }

    return String(value).trim().toLowerCase();

}

function compare(value, operator, target) {

    switch (operator) {

        case "equals":

            return normalize(value) === normalize(target);

        case "contains":

            return normalize(value).includes(
                normalize(target)
            );

        case "startsWith":

            return normalize(value).startsWith(
                normalize(target)
            );

        case "endsWith":

            return normalize(value).endsWith(
                normalize(target)
            );

        case "greaterThan":

            return Number(value) > Number(target);

        case "lessThan":

            return Number(value) < Number(target);

        case "greaterOrEqual":

            return Number(value) >= Number(target);

        case "lessOrEqual":

            return Number(value) <= Number(target);

        default:

            return false;

    }

}

module.exports = compare;