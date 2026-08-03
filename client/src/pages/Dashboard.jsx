import { useEffect, useState } from "react";

import MainLayout from "../components/layout/MainLayout";
import NewProjectModal from "../components/dashboard/NewProjectModal";
import RecentProjects from "../components/dashboard/RecentProjects";

import { getProjects } from "../services/projectService";

import "../styles/dashboard.css";

function Dashboard() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    async function loadProjects() {

        setLoading(true);

        const data = await getProjects();

        setProjects(data);

        setLoading(false);

    }

    useEffect(() => {

        loadProjects();

    }, []);

    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    function handleProjectCreated(newProject) {

        setProjects(previousProjects => [

            newProject,

            ...previousProjects

        ]);

        setShowModal(false);

    }

    return (

        <MainLayout searchQuery={searchQuery} onSearch={(value) => setSearchQuery(value)}>

            <h1>Welcome back!</h1>

            <p>

                Manage your spreadsheets, analytics and AI projects.

            </p>

            {loading ? (

                <p>Loading projects...</p>

            ) : (

                filteredProjects.length > 0 ? (
                    <RecentProjects
                        projects={filteredProjects}
                        onProjectRenamed={(updatedProject) =>
                            setProjects((items) => items.map((project) =>
                                project.id === updatedProject.id ? updatedProject : project
                            ))
                        }
                        onProjectDeleted={(projectId) =>
                            setProjects((items) => items.filter((project) => project.id !== projectId))
                        }
                    />
                ) : (
                    <p style={{ marginTop: "18px" }}>{searchQuery.trim() ? "Project not file" : "No projects found. Create your first project to get started."}</p>
                )

            )}

            <button

                onClick={() => setShowModal(true)}

                style={{

                    alignSelf: "flex-start",

                    marginTop: "30px",

                    padding: "14px 24px",

                    borderRadius: "10px",

                    cursor: "pointer"

                }}

            >

                + New Project

            </button>

            {showModal && (

                <NewProjectModal

                    onClose={() => setShowModal(false)}

                    onProjectCreated={handleProjectCreated}

                />

            )}

        </MainLayout>

    );

}

export default Dashboard;
