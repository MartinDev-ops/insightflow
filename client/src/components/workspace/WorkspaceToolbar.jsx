import { useRef } from "react";

function WorkspaceToolbar({

    onSave,
    onImport,
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
                gap: "12px",
                padding: "15px",
                borderBottom: "1px solid #ddd",
                background: "#fff"
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