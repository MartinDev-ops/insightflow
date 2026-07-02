import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { getProjects } from "../services/projectService";
import "../styles/dashboard.css";

import NewProjectModal from "../components/dashboard/NewProjectModal";
import RecentProjects from "../components/dashboard/RecentProjects";

function Dashboard() {

    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        async function loadProjects() {

            const data = await getProjects();

            setProjects(data);

        }

        loadProjects();

    }, []);

    function handleProjectCreated(newProject) {

        setProjects((previousProjects) => [

            newProject,

            ...previousProjects

        ]);

    }

    return (
        <MainLayout>

            <h1>Welcome back!</h1>

            <p>
                Manage your spreadsheets, analytics and AI projects.
            </p>

            <RecentProjects projects={projects} />

            <button
                onClick={() => setShowModal(true)}
                style={{
                    marginTop: "30px",
                    padding: "14px 24px",
                    borderRadius: "10px"
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