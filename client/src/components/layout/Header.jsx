import { useState } from "react";
import { Link } from "react-router-dom";

function Header({ searchQuery = "", onSearch }) {
    const [isSearching, setIsSearching] = useState(false);

    return (
        <header className="app-header">
            <Link to="/" className="app-brand" style={{ textDecoration: "none", color: "inherit" }}>
                <span className="app-logo" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4F8EF7" />
                                <stop offset="100%" stopColor="#1D5EFF" />
                            </linearGradient>
                        </defs>
                        <rect x="36" y="36" width="440" height="440" rx="110" fill="#F7F9FC" />
                        <rect x="118" y="112" width="180" height="240" rx="24" fill="url(#flow)" />
                        <path d="M258 112 L298 152 L258 152 Z" fill="#7FB2FF" />
                        <line x1="150" y1="185" x2="268" y2="185" stroke="white" strokeWidth="10" strokeLinecap="round" />
                        <line x1="150" y1="225" x2="268" y2="225" stroke="white" strokeWidth="10" strokeLinecap="round" />
                        <line x1="150" y1="265" x2="240" y2="265" stroke="white" strokeWidth="10" strokeLinecap="round" />
                        <circle cx="360" cy="170" r="18" fill="#1D5EFF" />
                        <circle cx="395" cy="255" r="18" fill="#1D5EFF" />
                        <circle cx="330" cy="325" r="18" fill="#1D5EFF" />
                        <line x1="360" y1="170" x2="395" y2="255" stroke="#1D5EFF" strokeWidth="8" />
                        <line x1="395" y1="255" x2="330" y2="325" stroke="#1D5EFF" strokeWidth="8" />
                        <line x1="330" y1="325" x2="360" y2="170" stroke="#1D5EFF" strokeWidth="8" />
                        <path d="M298 235 C330 235 335 205 360 190" fill="none" stroke="#1D5EFF" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                </span>
                <div>
                    <div className="app-logo-title">InsightFlow</div>
                    <div className="app-logo-subtitle">AI Spreadsheet Intelligence</div>
                </div>
            </Link>

            <div className="app-header-actions">
                <button type="button" className="icon-button" onClick={() => setIsSearching((v) => !v)} aria-label="Toggle search">🔍</button>
                {isSearching && (
                    <input
                        className="header-search"
                        value={searchQuery}
                        onChange={(event) => onSearch?.(event.target.value)}
                        placeholder="Search projects..."
                        autoFocus
                    />
                )}
                <button type="button" className="icon-button" aria-label="Notifications">🔔</button>
                <button type="button" className="icon-button" aria-label="Profile">👤</button>
            </div>
        </header>
    );
}

export default Header;