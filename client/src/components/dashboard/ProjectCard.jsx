import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {

    const navigate = useNavigate();

    return (
        <div
            className="project-card"
            onClick={() => navigate(`/projects/${project.id}`)}
            style={{ cursor: "pointer" }}
        >

            <div className="project-icon">
                📁
            </div>

            <div className="project-content">

                <h3>{project.name}</h3>

                <p>{project.category}</p>

                <span>Status: {project.status}</span>

            </div>

        </div>
    );
}

export default ProjectCard;