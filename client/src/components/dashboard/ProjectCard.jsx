import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProject, renameProject } from "../../services/projectService";

function ProjectCard({ project, onProjectRenamed, onProjectDeleted }) {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        function closeMenu(event) {
            if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
        }

        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    function openProject() {
        navigate(`/projects/${project.id}`);
    }

    function viewAnalytics() {
        navigate(`/projects/${project.id}/analytics`);
    }

    async function handleRename() {
        const name = window.prompt("Rename project", project.name);

        if (!name?.trim() || name.trim() === project.name) return;

        try {
            const updatedProject = await renameProject(project.id, name.trim());
            onProjectRenamed?.(updatedProject);
        } catch (error) {
            console.error(error);
            window.alert("Could not rename the project. Please try again.");
        } finally {
            setMenuOpen(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm(`Delete “${project.name}”? This also deletes its workbook.`)) return;

        try {
            await deleteProject(project.id);
            onProjectDeleted?.(project.id);
        } catch (error) {
            console.error(error);
            window.alert("Could not delete the project. Please try again.");
        } finally {
            setMenuOpen(false);
        }
    }

    return (
        <article
            className={`project-card${menuOpen ? " menu-is-open" : ""}`}
            onClick={openProject}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") openProject();
            }}
        >
            <div className="project-icon">📁</div>

            <div className="project-content">
                <h3>{project.name}</h3>
                <p>{project.category || "Spreadsheet project"}</p>
                <span>{project.status ? `Status: ${project.status}` : "Ready to analyse"}</span>
            </div>

            <div className="project-actions" ref={menuRef} onClick={(event) => event.stopPropagation()}>
                <button
                    className="project-menu-trigger"
                    type="button"
                    aria-label={`Actions for ${project.name}`}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    ⋮
                </button>

                {menuOpen && (
                    <div className="project-menu" role="menu">
                        <button type="button" role="menuitem" onClick={openProject}>Open Project</button>
                        <button type="button" role="menuitem" onClick={viewAnalytics}>View Analytics</button>
                        <button type="button" role="menuitem" onClick={handleRename}>Rename</button>
                        <button type="button" role="menuitem" className="danger" onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
        </article>
    );
}

export default ProjectCard;
