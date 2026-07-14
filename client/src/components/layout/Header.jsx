function Header() {
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

            <div>
                🔍 Search &nbsp;&nbsp;&nbsp;
                🔔 &nbsp;&nbsp;&nbsp;
                👤
            </div>
        </header>
    );
}

export default Header;