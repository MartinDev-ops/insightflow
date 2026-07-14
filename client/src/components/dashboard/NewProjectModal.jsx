import { useState } from "react";
import { createProject } from "../../services/projectService";

function NewProjectModal({ onClose, onProjectCreated }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Sales");

    const [creating, setCreating] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        if (!name.trim()) {

            alert("Project name is required.");

            return;

        }

        setCreating(true);

        const newProject = await createProject({
            name: name.trim(),
            description: description.trim(),
            category
        });

        setCreating(false);

        if (!newProject) {

            alert("Failed to create project.");

            return;

        }

        onProjectCreated(newProject);

        onClose();

    }

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>Create New Project</h2>

                <form onSubmit={handleSubmit}>

                    <label>Project Name</label>

                    <input
                        type="text"
                        placeholder="Enter project name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Description</label>

                    <textarea
                        placeholder="Project description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option>Sales</option>
                        <option>Finance</option>
                        <option>HR</option>
                        <option>Marketing</option>
                    </select>

                    <div className="modal-actions">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={creating}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={creating}
                        >
                            {creating ? "Creating..." : "Create Project"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default NewProjectModal;