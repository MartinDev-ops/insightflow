const API_URL = "http://localhost:5001/export";

export async function exportWorkbook(projectId) {

    const response = await fetch(`${API_URL}/${projectId}`);

    if (!response.ok) {

        throw new Error("Failed to export workbook.");

    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `Project-${projectId}.xlsx`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

}