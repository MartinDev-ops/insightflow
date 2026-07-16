function CleanPreview({

    open,
    summary,
    onApply,
    onCancel

}) {

    if (!open) {

        return null;

    }

    return (

        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.35)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >

            <div
                style={{
                    width: "500px",
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 10px 30px rgba(0,0,0,.2)"
                }}
            >

                <h2>🧹 Data Cleaning Summary</h2>

                <hr />

                <p>
                    <strong>Duplicates Found:</strong>{" "}
                    {summary.duplicates}
                </p>

                <p>
                    <strong>Empty Cells:</strong>{" "}
                    {summary.emptyCells}
                </p>

                <p>
                    <strong>Phone Numbers Fixed:</strong>{" "}
                    {summary.phoneNumbers}
                </p>

                <p>
                    <strong>Dates Standardized:</strong>{" "}
                    {summary.dates}
                </p>

                <p>
                    <strong>Extra Spaces Removed:</strong>{" "}
                    {summary.trimmed}
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        marginTop: "20px"
                    }}
                >

                    <button onClick={onCancel}>

                        Cancel

                    </button>

                    <button onClick={onApply}>

                        ✅ Apply Changes

                    </button>

                </div>

            </div>

        </div>

    );

}

export default CleanPreview;