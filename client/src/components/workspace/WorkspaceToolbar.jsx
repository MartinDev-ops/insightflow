import { useRef } from "react";
import { Link } from "react-router-dom";

function WorkspaceToolbar({

    projectId,
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

            <Link
                to={`/projects/${projectId}/analytics`}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginLeft: "auto",
                    padding: "9px 12px",
                    border: "1px solid #D6D0C6",
                    borderRadius: 7,
                    background: "#FFFFFF",
                    color: "#1F2937",
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    textDecoration: "none"
                }}
            >
                View dashboard <span aria-hidden="true">→</span>
            </Link>

        </div>

    );

}

export default WorkspaceToolbar;