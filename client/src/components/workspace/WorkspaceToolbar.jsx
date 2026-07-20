import { useRef } from "react";

function WorkspaceToolbar({

    onSave,
    onImport,
    onClean,
    saving

}) {

    const fileInputRef = useRef(null);

    function handleImportClick() {

        fileInputRef.current.click();

    }

    function handleFileChange(event) {

        const file = event.target.files[0];

        if (file && onImport) {

            onImport(file);

        }

        event.target.value = "";

    }

    return (

        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 15,
                borderBottom: "1px solid #ddd",
                background: "#fff",
                flexShrink: 0
            }}
        >

            <button
                onClick={onSave}
                disabled={saving}
            >
                {saving ? "⏳ Saving..." : "💾 Save"}
            </button>

            <button onClick={handleImportClick}>
                📂 Import Excel
            </button>

            <button onClick={onClean}>
                🧹 Clean Data
            </button>

            <button>
                📤 Export Excel
            </button>

            <button>
                🤖 AI Analyze
            </button>

            <button>
                🔄 Refresh
            </button>

            <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

        </div>

    );

}

export default WorkspaceToolbar;