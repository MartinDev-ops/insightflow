import { parseQuery } from "../ai/queryParser";

const API_URL = "http://localhost:5001/ai";

export async function askAI(workbook, userPrompt) {

    const query = parseQuery(userPrompt);

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            workbook,
            query

        })

    });

    if (!response.ok) {

        throw new Error("AI request failed.");

    }

    return await response.json();

}