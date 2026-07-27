import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import { getProject } from "../services/projectService";
import { getWorkbook } from "../services/workbookService";
import { analyseWorkbook } from "../utils/workbookAnalytics";
import "../styles/analytics.css";

function ProjectAnalytics() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAnalytics() {
            try {
                const [projectData, workbookData] = await Promise.all([
                    getProject(id),
                    getWorkbook(id)
                ]);

                setProject(projectData);
                setAnalytics(analyseWorkbook(workbookData.workbook_data));
            } catch (loadError) {
                console.error(loadError);
                setError("We could not load this project's analytics.");
            }
        }

        loadAnalytics();
    }, [id]);

    if (error) return <MainLayout variant="analytics"><p>{error}</p></MainLayout>;

    if (!project || !analytics) return <MainLayout variant="analytics"><p>Loading analytics...</p></MainLayout>;

    return <MainLayout variant="analytics">
        <div className="analytics-page">
            <div className="analytics-heading">
                <div>
                    <nav className="analytics-breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Projects</Link>
                        <span>/</span>
                        <span>{project.name}</span>
                    </nav>
                    <h1>Analytics overview</h1>
                    <p>First worksheet · {analytics.rows.toLocaleString()} records</p>
                </div>
                <Link className="analytics-open-button" to={`/projects/${id}`}>Open in editor <span aria-hidden="true">→</span></Link>
            </div>

            {analytics.rows === 0 ? <div className="analytics-no-data">
                <h2>Your spreadsheet is ready for data</h2>
                <p>Add a header row and at least one data row, save the workbook, then return here for charts and quality checks.</p>
                <Link className="analytics-open-button" to={`/projects/${id}`}>
                    <span className="workbook-icon" aria-hidden="true">▦</span>
                    Open workbook
                </Link>
            </div> : <>
                <div className="analytics-stats">
                    <section><span>Total rows</span><strong>{analytics.rows.toLocaleString()}</strong></section>
                    <section><span>Columns</span><strong>{analytics.columns.toLocaleString()}</strong></section>
                    <section><span>Duplicate rows</span><strong>{analytics.duplicates.toLocaleString()}</strong></section>
                    <section><span>Missing values</span><strong>{analytics.missing.toLocaleString()}</strong></section>
                </div>

                <AnalyticsCharts charts={analytics.charts} />
            </>}
        </div>
    </MainLayout>;
}

export default ProjectAnalytics;
