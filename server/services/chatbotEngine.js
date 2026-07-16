function chatbotEngine(question, workbook) {

    const q = question.toLowerCase().trim();

    // ---------------------------------
    // Empty question
    // ---------------------------------

    if (!q) {

        return {

            message: "Please type a question."

        };

    }

    // ---------------------------------
    // Greetings
    // ---------------------------------

    if (
        q === "hi" ||
        q === "hello" ||
        q === "hey"
    ) {

        return {

            message:
                "Hi 👋 Ask me anything about your spreadsheet."

        };

    }

    // ---------------------------------
    // Basic Math
    // ---------------------------------

    if (/^\d+\s*[\+\-\*\/]\s*\d+$/.test(q)) {

        try {

            const answer = Function(
                `"use strict"; return (${q})`
            )();

            return {

                message: String(answer)

            };

        }

        catch {

            return {

                message:
                    "I couldn't calculate that."

            };

        }

    }

    // ---------------------------------
    // Workbook exists?
    // ---------------------------------

    if (
        !workbook ||
        !workbook.sheets
    ) {

        return {

            message:
                "No spreadsheet is currently loaded."

        };

    }

    // ---------------------------------
    // Unknown
    // ---------------------------------

    return {

        message:
            "I don't understand that request. Try asking something like:\n\n• Show employees in IT\n• Employees earning above 30000\n• Highest salary\n• Total employees"

    };

}

module.exports = {

    chatbotEngine

};