import API_BASE_URL from "./config";
import { getVisitorId } from "./visitorId";

const API_URL = `${API_BASE_URL}/workbooks`;

export async function getWorkbook(projectId) {

    const response = await fetch(`${API_URL}/${projectId}`, {

        headers: {

            "X-Visitor-Id": getVisitorId()

        }

    });

    if (!response.ok) {

        throw new Error("Failed to load workbook.");

    }

    return await response.json();

}

export async function saveWorkbook(projectId, workbookData) {

    const response = await fetch(`${API_URL}/${projectId}`, {

        method: "PUT",

        headers: {

            "Content-Type": "application/json",

            "X-Visitor-Id": getVisitorId()

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