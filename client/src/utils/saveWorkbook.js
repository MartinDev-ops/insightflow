export async function saveCurrentWorkbook(projectId, univerAPI) {

    if (!univerAPI) {

        throw new Error("Univer API not ready.");

    }

    const workbook = univerAPI.getActiveWorkbook();

    if (!workbook) {

        throw new Error("No active workbook.");

    }

    const snapshot = workbook.save();

    const response = await fetch(
        `http://localhost:5001/workbooks/${projectId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                workbook_data: snapshot
            })
        }
    );

    if (!response.ok) {

        throw new Error("Failed to save workbook.");

    }

    console.log("✅ Workbook saved.");

    return await response.json();

}