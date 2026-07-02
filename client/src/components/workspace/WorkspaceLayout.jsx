function WorkspaceLayout({ children }) {

    return (

        <div>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    padding: "15px",
                    borderBottom: "1px solid #ddd",
                    background: "#fff"
                }}
            >

                <button>Spreadsheet</button>

                <button>Charts</button>

                <button>AI</button>

                <button>Reports</button>

                <button>Power BI</button>

                <button>Files</button>

                <button>Settings</button>

            </div>

            <div
                style={{
                    padding: "30px"
                }}
            >
                {children}
            </div>

        </div>

    );

}

export default WorkspaceLayout;