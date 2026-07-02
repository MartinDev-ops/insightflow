import { useState } from "react";
import { createProject } from "../../services/projectService";


function NewProjectModal({ onClose, onProjectCreated }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Sales");

    async function handleSubmit(e) {
           
                 e.preventDefault();

    if (!name.trim()) {

        alert("Project name is required.");

        return;

    }

    const newProject = await createProject({
        name,
        description,
        category
    });

    if (newProject) {

        onProjectCreated(newProject);

        onClose();

    }

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
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Create Project
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default NewProjectModal;