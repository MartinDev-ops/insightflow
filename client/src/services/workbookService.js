const API_URL = "http://localhost:5001/workbooks";

export async function getWorkbook(projectId) {

    const response = await fetch(`${API_URL}/${projectId}`);

    if (!response.ok) {

        throw new Error("Failed to load workbook.");

    }

    return await response.json();

}

export async function saveWorkbook(projectId, workbookData) {

    const response = await fetch(`${API_URL}/${projectId}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            workbook_data: workbookData

        })

    });

    if (!response.ok) {

        throw new Error("Failed to save workbook.");

    }

    return await response.json();

}