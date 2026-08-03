import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/clean`;

export async function cleanWorkbook(workbook) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            workbook

        })

    });

    if (!response.ok) {

        throw new Error("Cleaning failed.");

    }

    return await response.json();

}