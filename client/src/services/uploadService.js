import API_BASE_URL from "./config";
import { getAuthHeaders } from "./visitorId";

const API_URL = `${API_BASE_URL}/upload`;

export async function uploadExcel(file) {

    const formData = new FormData();

    formData.append("files", file);

    const response = await fetch(API_URL, {

        method: "POST",

        // Required header, so it must be set explicitly; the browser sets the
        // multipart Content-Type itself from the FormData boundary.
        headers: await getAuthHeaders(),

        body: formData

    });

    if (!response.ok) {

        throw new Error("Failed to upload workbook.");

    }

    return await response.json();

}