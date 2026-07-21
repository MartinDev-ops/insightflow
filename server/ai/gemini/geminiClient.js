require("dotenv").config();

console.log(
    "Gemini API key loaded:",
    process.env.GEMINI_API_KEY ? "YES" : "NO"
);

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY

});

async function askGemini(prompt) {

    try {

        const response = await ai.models.generateContent({

            model: "gemini-flash-latest",

            contents: prompt

        });

        return response.text;

    }

    catch (error) {

        console.error(error);

        throw error;

    }

}

module.exports = {

    askGemini

};