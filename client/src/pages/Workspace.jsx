import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import SpreadsheetView from "../components/workspace/SpreadsheetView";

import { saveCurrentWorkbook } from "../utils/saveWorkbook";
import { uploadExcel } from "../services/uploadService";
import { getWorkbook } from "../services/workbookService";

function Workspace() {

    const { id } = useParams();

    const univerRef = useRef(null);

    const [importedWorkbook, setImportedWorkbook] = useState(null);

    const [loadingWorkbook, setLoadingWorkbook] = useState(true);

    function handleSpreadsheetReady(univerAPI) {

        univerRef.current = univerAPI;

        console.log("✅ Univer is ready");

    }

    useEffect(() => {

        async function loadWorkbook() {

            try {

                const workbook = await getWorkbook(id);

                if (workbook?.workbook_data) {

                    console.log("Workbook loaded from Supabase");

                    setImportedWorkbook(workbook.workbook_data);

                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoadingWorkbook(false);

            }

        }

        loadWorkbook();

    }, [id]);

    async function handleSave() {

        if (!univerRef.current) {

            alert("Spreadsheet is not ready yet.");

            return;

        }

        try {

            await saveCurrentWorkbook(univerRef.current, id);

            alert("✅ Workbook saved successfully!");

        }

        catch {

            alert("❌ Failed to save workbook.");

        }

    }

    async function handleImport(file) {

        try {

            const result = await uploadExcel(file);

            setImportedWorkbook(result.workbook);

            alert("Excel imported successfully!");

        }

        catch (error) {

            console.error(error);

            alert("Failed to import Excel file.");

        }

    }

    if (loadingWorkbook) {

        return (

            <MainLayout>

                <p>Loading workbook...</p>

            </MainLayout>

        );

    }

    return (

        <MainLayout>

            <h1>Project #{id}</h1>

            <WorkspaceLayout

                onSave={handleSave}

                onImport={handleImport}

            >

                <SpreadsheetView

                    projectId={id}

                    importedWorkbook={importedWorkbook}

                    onReady={handleSpreadsheetReady}

                />

            </WorkspaceLayout>

        </MainLayout>

    );

}

export default Workspace;