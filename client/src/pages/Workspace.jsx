import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import SpreadsheetView from "../components/workspace/SpreadsheetView";
import CleanPreview from "../components/workspace/CleanPreview";

import { saveCurrentWorkbook } from "../utils/saveWorkbook";
import { uploadExcel } from "../services/uploadService";
import { getWorkbook } from "../services/workbookService";
import { cleanWorkbook } from "../services/cleanService";

function Workspace() {

    const { id } = useParams();

    const univerRef = useRef(null);

    const [importedWorkbook, setImportedWorkbook] = useState(null);
    const [loadingWorkbook, setLoadingWorkbook] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showCleanPreview, setShowCleanPreview] = useState(false);

    const [cleanSummary, setCleanSummary] = useState({
        duplicates: 0,
        emptyCells: 0,
        phoneNumbers: 0,
        dates: 0,
        trimmed: 0
    });

    function handleSpreadsheetReady(univerAPI) {

        univerRef.current = univerAPI;

        console.log("✅ Univer is ready");

    }

    useEffect(() => {

        async function loadWorkbook() {

            try {

                const workbook = await getWorkbook(id);

                if (workbook?.workbook_data) {

                    setImportedWorkbook(workbook.workbook_data);

                }

            }

            catch (error) {

                console.error(error);

            }

            finally {

                setLoadingWorkbook(false);

            }

        }

        loadWorkbook();

    }, [id]);

    async function handleSave() {

        if (saving) return;

        try {

            setSaving(true);

            await saveCurrentWorkbook(id, univerRef.current);

        }

        catch (error) {

            console.error(error);

            alert("❌ Failed to save workbook.");

        }

        finally {

            setSaving(false);

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

    async function handleClean() {

        try {

            if (!univerRef.current) return;

            const workbook =
                univerRef.current
                    .getActiveWorkbook()
                    .save();

            const result = await cleanWorkbook(workbook);

            setImportedWorkbook(result.workbook);

            if (result.summary) {

                setCleanSummary(result.summary);

            }

            setShowCleanPreview(true);

        }

        catch (error) {

            console.error(error);

            alert("Cleaning failed.");

        }

    }

    async function applyCleaning() {

        try {

            setShowCleanPreview(false);

            setTimeout(async () => {

                await saveCurrentWorkbook(id, univerRef.current);

                alert("✅ Cleaned workbook saved.");

            }, 500);

        }

        catch (error) {

            console.error(error);

            alert("Failed to save cleaned workbook.");

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

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    height: "100%",
                    minHeight: 0
                }}
            >

                <h1
                    style={{
                        margin: 0,
                        flexShrink: 0
                    }}
                >
                    Project #{id}
                </h1>

                <WorkspaceLayout

                    workbook={importedWorkbook}

                    onWorkbookUpdate={setImportedWorkbook}

                    onSave={handleSave}

                    onImport={handleImport}

                    onClean={handleClean}

                    saving={saving}

                >

                    <SpreadsheetView

                        importedWorkbook={importedWorkbook}

                        onReady={handleSpreadsheetReady}

                        univerRef={univerRef}

                    />

                </WorkspaceLayout>

            </div>

            <CleanPreview

                open={showCleanPreview}

                summary={cleanSummary}

                onApply={applyCleaning}

                onCancel={() => setShowCleanPreview(false)}

            />

        </MainLayout>

    );

}

export default Workspace;