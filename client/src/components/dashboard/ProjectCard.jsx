function ProjectCard({ project }) {
    return (
        <div className="project-card">

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