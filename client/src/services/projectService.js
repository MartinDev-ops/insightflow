const API_URL = "http://localhost:5001/projects";

export async function getProjects() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Failed to fetch projects.");

        }

        return await response.json();

    }

    catch (error) {

        console.error("Error fetching projects:", error);

        return [];

    }

}

export async function getProject(projectId) {
    const response = await fetch(`${API_URL}/${projectId}`);
    if (!response.ok) throw new Error("Failed to load project.");
    return await response.json();
}

export async function renameProject(projectId, name) {
    const response = await fetch(`${API_URL}/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error("Failed to rename project.");
    return await response.json();
}

export async function deleteProject(projectId) {
    const response = await fetch(`${API_URL}/${projectId}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete project.");
}

export async function createProject(project) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(project)

        });

        if (!response.ok) {

            throw new Error("Failed to create project.");

        }

        return await response.json();

    }

    catch (error) {

        console.error("Error creating project:", error);

        return null;

    }

}
