import WorkspaceToolbar from "./WorkspaceToolbar";

import AIPanel from "./ai/AIPanel";


function WorkspaceLayout({

    children,

    projectId,

    onSave,

    onImport,

    onClean,

    saving,

    workbook,

    getLiveWorkbook,

    onWorkbookUpdate,

    onFilterApplied,

    onClearFilter

}) {


    return (

        <div

            style={{

                display: "flex",

                flexDirection: "column",

                width: "100%",

                flex: 1,

                minHeight: 0,

                background: "#fff",

                borderRadius: 8,

                boxShadow:

                    "0 2px 8px rgba(0,0,0,0.08)",

                overflow: "hidden"

            }}

        >


            <div

                style={{

                    flexShrink: 0

                }}

            >

                <WorkspaceToolbar

                    onSave={

                        onSave

                    }

                    onImport={

                        onImport

                    }

                    onClean={

                        onClean

                    }

                    saving={

                        saving

                    }

                />

            </div>


            <div

                style={{

                    display: "flex",

                    alignItems: "stretch",

                    width: "100%",

                    flex: 1,

                    minHeight: 0,

                    overflow: "hidden"

                }}

            >


                <div

                    style={{

                        flex: 1,

                        minWidth: 0,

                        minHeight: 0,

                        overflow: "hidden",

                        display: "flex"

                    }}

                >

                    {children}

                </div>


                <AIPanel

                    projectId={

                        projectId

                    }

                    workbook={

                        workbook

                    }

                    getLiveWorkbook={

                        getLiveWorkbook

                    }

                    onWorkbookUpdate={

                        onWorkbookUpdate

                    }

                    onFilterApplied={

                        onFilterApplied

                    }

                    onClearFilter={

                        onClearFilter

                    }

                />


            </div>


        </div>

    );

}


export default WorkspaceLayout;
