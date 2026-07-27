import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import SpreadsheetView from "../components/workspace/SpreadsheetView";
import CleanPreview from "../components/workspace/CleanPreview";

import { saveCurrentWorkbook } from "../utils/saveWorkbook";
import { uploadExcel } from "../services/uploadService";
import { getWorkbook } from "../services/workbookService";
import { cleanWorkbook } from "../services/cleanService";
import { getActiveWorkbookSnapshot } from "../utils/getActiveWorkbookSnapshot";

function Workspace() {

    const { id } = useParams();

    const univerRef = useRef(null);

    const [originalWorkbook, setOriginalWorkbook] =
        useState(null);

    const [currentWorkbook, setCurrentWorkbook] =
        useState(null);

    const [importedWorkbook, setImportedWorkbook] =
        useState(null);

    const [loadingWorkbook, setLoadingWorkbook] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [showCleanPreview, setShowCleanPreview] =
        useState(false);

    const [filterResult, setFilterResult] =
        useState(null);

    const [cleanSummary, setCleanSummary] = useState({

        duplicates: 0,

        emptyCells: 0,

        phoneNumbers: 0,

        dates: 0,

        trimmed: 0

    });


    function handleSpreadsheetReady(univerAPI) {

        univerRef.current = univerAPI;

        console.log(

            "✅ Univer is ready"

        );

    }


    function handleWorkbookChange(workbookSnapshot) {

        setCurrentWorkbook(workbookSnapshot);

    }


    function getLiveWorkbook() {

        return getActiveWorkbookSnapshot(univerRef.current)
            || currentWorkbook;

    }


    function handleWorkbookUpdate(workbook) {

        setCurrentWorkbook(workbook);
        setImportedWorkbook(workbook);

    }


    useEffect(() => {

        async function loadWorkbook() {

            try {

                const workbook =
                    await getWorkbook(id);


                if (

                    workbook?.workbook_data

                ) {

                    const loadedWorkbook =
                        workbook.workbook_data;


                    setOriginalWorkbook(

                        loadedWorkbook

                    );


                    setCurrentWorkbook(loadedWorkbook);

                    setImportedWorkbook(

                        loadedWorkbook

                    );

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


            await saveCurrentWorkbook(

                id,

                univerRef.current

            );

        }

        catch (error) {

            console.error(error);


            alert(

                "❌ Failed to save workbook."

            );

        }

        finally {

            setSaving(false);

        }

    }


    async function handleImport(file) {

        try {

            const result =
                await uploadExcel(file);


            const newWorkbook =
                result.workbook;


            setOriginalWorkbook(

                newWorkbook

            );


            setCurrentWorkbook(newWorkbook);

            setImportedWorkbook(

                newWorkbook

            );

            setFilterResult(null);


            alert(

                "Excel imported successfully!"

            );

        }

        catch (error) {

            console.error(error);


            alert(

                "Failed to import Excel file."

            );

        }

    }


    async function handleClean() {

        try {

            if (!univerRef.current) return;


            const workbook =

                univerRef.current

                    .getActiveWorkbook()

                    .save();


            const result =

                await cleanWorkbook(

                    workbook

                );


            setOriginalWorkbook(

                result.workbook

            );


            setCurrentWorkbook(result.workbook);

            setImportedWorkbook(

                result.workbook

            );

            setFilterResult(null);


            if (result.summary) {

                setCleanSummary(

                    result.summary

                );

            }


            setShowCleanPreview(true);

        }

        catch (error) {

            console.error(error);


            alert(

                "Cleaning failed."

            );

        }

    }


    async function applyCleaning() {

        try {

            setShowCleanPreview(false);


            setTimeout(async () => {

                await saveCurrentWorkbook(

                    id,

                    univerRef.current

                );


                alert(

                    "✅ Cleaned workbook saved."

                );

            }, 500);

        }

        catch (error) {

            console.error(error);


            alert(

                "Failed to save cleaned workbook."

            );

        }

    }


    function clearFilter() {

        setFilterResult(null);

    }


    if (loadingWorkbook) {

        return (

            <MainLayout>

                <p>

                    Loading workbook...

                </p>

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

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                        flexShrink: 0
                    }}
                >
                    <h1 style={{ margin: 0 }}>Project #{id}</h1>

                    <Link
                        to={`/projects/${id}/analytics`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "9px 12px",
                            border: "1px solid #D6D0C6",
                            borderRadius: 7,
                            background: "#FFFFFF",
                            color: "#1F2937",
                            fontSize: 14,
                            fontWeight: 600,
                            whiteSpace: "nowrap"
                        }}
                    >
                        View dashboard <span aria-hidden="true">→</span>
                    </Link>
                </div>


                <WorkspaceLayout

                    projectId={

                        id

                    }

                    workbook={

                        currentWorkbook

                    }

                    getLiveWorkbook={

                        getLiveWorkbook

                    }

                    onWorkbookUpdate={

                        handleWorkbookUpdate

                    }

                    onFilterApplied={

                        setFilterResult

                    }

                    onSave={

                        handleSave

                    }

                    onImport={

                        handleImport

                    }

                    onClean={

                        handleClean

                    }

                    saving={

                        saving

                    }

                    univerAPI={

                        univerRef.current

                    }

                    onClearFilter={

                        clearFilter

                    }

                >

                    <SpreadsheetView

                        filterResult={

                            filterResult

                        }

                        importedWorkbook={

                            importedWorkbook

                        }

                        onWorkbookChange={

                            handleWorkbookChange

                        }

                        onReady={

                            handleSpreadsheetReady

                        }

                        univerRef={

                            univerRef

                        }

                    />

                </WorkspaceLayout>

            </div>


            <CleanPreview

                open={

                    showCleanPreview

                }

                summary={

                    cleanSummary

                }

                onApply={

                    applyCleaning

                }

                onCancel={() =>

                    setShowCleanPreview(

                        false

                    )

                }

            />

        </MainLayout>

    );

}


export default Workspace;
