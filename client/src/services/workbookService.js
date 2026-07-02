const API_URL = "http://localhost:5000/workbooks";

// Get workbook for a project
export async function getWorkbook(projectId) {

    const response = await fetch(`${API_URL}/${projectId}`);

    if (!response.ok) {
        throw new Error("Failed to load workbook");
    }

    return await response.json();
}

// Save workbook
export async function saveWorkbook(projectId, workbook_data) {

    const response = await fetch(`${API_URL}/${projectId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            workbook_data
        })

    });

    if (!response.ok) {
        throw new Error("Failed to save workbook");
    }

    return await response.json();

}