const { askGemini } = require("../gemini/geminiClient");
const { buildRouterPrompt } = require("./routerPrompt");

async function routeQuestion(question) {

    const response =
        await askGemini(
            buildRouterPrompt(question)
        );

    return response
        .trim()
        .toLowerCase();

}

module.exports = {

    routeQuestion

};