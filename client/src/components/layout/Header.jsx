import { useState } from "react";

function Header({ searchQuery = "", onSearch }) {
    const [isSearching, setIsSearching] = useState(false);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };

    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "40px"
            }}
        >
            <h2>InsightFlow</h2>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <button
                    onClick={() => setIsSearching((value) => !value)}
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px"
                    }}
                    aria-label="Toggle search"
                >
                    🔍
                </button>

                {isSearching && (
                    <input
                        value={searchQuery}
                        onChange={(event) => onSearch?.(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type project name"
                        autoFocus
                        style={{
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            minWidth: "220px"
                        }}
                    />
                )}

                <span>🔔</span>
                <span>👤</span>
            </div>
        </header>
    );
}

export default Header;