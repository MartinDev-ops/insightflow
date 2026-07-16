const API_URL = "http://localhost:5001/clean";

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