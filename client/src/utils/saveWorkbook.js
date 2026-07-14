import { saveWorkbook } from "../services/workbookService";

export async function saveCurrentWorkbook(univerAPI, projectId) {

    if (!univerAPI) {

        throw new Error("Univer API is not initialized.");

    }

    try {

        // Get the active workbook
        const workbook = univerAPI.getActiveWorkbook();

        if (!workbook) {

            throw new Error("No active workbook found.");

        }

        // Export workbook snapshot
        const snapshot = workbook.getSnapshot();

        // Save to backend
        await saveWorkbook(projectId, snapshot);

        console.log("✅ Workbook saved successfully.");

        return true;

    } catch (error) {

        console.error("Save Workbook Error:", error);

        throw error;

    }

}