import { parseQuery } from "../ai/queryParser";
import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/ai`;

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