function classifyQuestion(question = "") {

    const q = question.toLowerCase();

    // ------------------------------------
    // Workbook Intent
    // ------------------------------------

    const workbookKeywords = [

        "show",
        "find",
        "filter",
        "list",
        "sort",
        "group",
        "average",
        "sum",
        "count",
        "highest",
        "lowest",
        "salary",
        "employee",
        "student",
        "patient",
        "customer",
        "department",
        "sheet",
        "spreadsheet",
        "excel",
        "table",
        "column",
        "row",
        "duplicate",
        "clean",
        "remove"

    ];

    // ------------------------------------
    // General AI
    // ------------------------------------

    const generalKeywords = [

        "who is",
        "what is",
        "where is",
        "when was",
        "why",
        "history",
        "explain",
        "define",
        "tell me about",
        "capital",
        "president",
        "prime minister",
        "weather",
        "country",
        "universe",
        "physics",
        "chemistry"

    ];

    // ------------------------------------
    // Workbook + AI
    // ------------------------------------

    const hybridKeywords = [

        "recommend",

        "suggest",

        "predict",

        "analyse",

        "analyze",

        "insight",

        "summarise",

        "summarize",

        "why are",

        "possible reasons",

        "trend",

        "forecast"

    ];

    // ------------------------------------

    if (

        hybridKeywords.some(word =>

            q.includes(word)

        )

    ) {

        return "hybrid";

    }

    if (

        workbookKeywords.some(word =>

            q.includes(word)

        )

    ) {

        return "workbook";

    }

    if (

        generalKeywords.some(word =>

            q.includes(word)

        )

    ) {

        return "general";

    }

    return "workbook";

}

module.exports = {

    classifyQuestion

};