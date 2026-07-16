import WorkspaceToolbar from "./WorkspaceToolbar";
import AIPanel from "./AIPanel";

function WorkspaceLayout({
    children,
    onSave,
    onImport,
    onClean,
    onAskAI,
    saving,
    workbook
}) {

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
        >

            <WorkspaceToolbar
                onSave={onSave}
                onImport={onImport}
                onClean={onClean}
                saving={saving}
            />

            <div
                style={{
                    display: "flex",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden"
                }}
            >

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden"
                    }}
                >

                    {children}

                </div>

                <AIPanel workbook={workbook} />

            </div>

        </div>

    );

}

export default WorkspaceLayout;