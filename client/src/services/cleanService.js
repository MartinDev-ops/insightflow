import API_BASE_URL from "./config";
import { getAuthHeaders } from "./visitorId";

const API_URL = `${API_BASE_URL}/clean`;

export async function cleanWorkbook(workbook) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: await getAuthHeaders({

            "Content-Type": "application/json"

        }),

        body: JSON.stringify({

            workbook

        })

    });

    if (!response.ok) {

        throw new Error("Cleaning failed.");

    }

    return await response.json();

}