const API_URL = "http://localhost:5001/upload";

export async function uploadExcel(file) {

    const formData = new FormData();

    formData.append("files", file);

    const response = await fetch(API_URL, {

        method: "POST",

        body: formData

    });

    if (!response.ok) {

        throw new Error("Failed to upload workbook.");

    }

    return await response.json();

}