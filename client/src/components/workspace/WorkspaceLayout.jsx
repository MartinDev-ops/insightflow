import WorkspaceToolbar from "./WorkspaceToolbar";
import AIPanel from "./AIPanel";

function WorkspaceLayout({ children, onSave, onImport }) {

    return (

        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%"
            }}
        >

            <WorkspaceToolbar  

            onSave={onSave}
            onImport={onImport} 

            />

            <div
                style={{
                    display: "flex",
                    flex: 1
                }}
            >

                <div
                    style={{
                        flex: 1
                    }}
                >
                    {children}
                </div>

                <AIPanel />

            </div>

        </div>

    );

}

export default WorkspaceLayout;