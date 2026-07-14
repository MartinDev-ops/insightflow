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

    async function loadProjects() {

        setLoading(true);

        const data = await getProjects();

        setProjects(data);

        setLoading(false);

    }

    useEffect(() => {

        loadProjects();

    }, []);

    function handleProjectCreated(newProject) {

        setProjects(previousProjects => [

            newProject,

            ...previousProjects

        ]);

        setShowModal(false);

    }

    return (

        <MainLayout>

            <h1>Welcome back!</h1>

            <p>

                Manage your spreadsheets, analytics and AI projects.

            </p>

            {loading ? (

                <p>Loading projects...</p>

            ) : (

                <RecentProjects projects={projects} />

            )}

            <button

                onClick={() => setShowModal(true)}

                style={{

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