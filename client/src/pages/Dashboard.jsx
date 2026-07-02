import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { getProjects } from "../services/projectService";
import ProjectCard from "../components/dashboard/ProjectCard";
import "../styles/dashboard.css";

function Dashboard() {

    const [projects, setProjects] = useState([]);

    useEffect(() => {

        async function loadProjects() {

            const data = await getProjects();

            setProjects(data);

        }

        loadProjects();

    }, []);

    return (
        <MainLayout>

            <h1>Welcome back!</h1>

            <p>
                Manage your spreadsheets, analytics and AI projects.
            </p>

            <h2 style={{ marginTop: "40px" }}>
                Recent Projects
            </h2>

            {projects.length === 0 ? (

                <p>No projects found.</p>

            ) : (

                projects.map(project => (

                    <ProjectCard
                        key={project.id}
                        project={project}
                    />

                ))

            )}

            <button
                style={{
                    marginTop: "30px",
                    padding: "14px 24px",
                    borderRadius: "10px"
                }}
            >
                + New Project
            </button>

        </MainLayout>
    );
}

export default Dashboard;