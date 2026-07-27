import ProjectCard from "./ProjectCard";

function RecentProjects({ projects = [], onProjectRenamed, onProjectDeleted }) {

    return (

        <div>

            <h2 style={{ marginBottom: "20px" }}>
                Recent Projects
            </h2>

            {projects.length === 0 ? (

                <p>No projects found. Create your first project to get started.</p>

            ) : (

                <div>

                    {projects.map((project) => (

                        <ProjectCard
                            key={project.id}
                            project={project}
                            onProjectRenamed={onProjectRenamed}
                            onProjectDeleted={onProjectDeleted}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}

export default RecentProjects;
