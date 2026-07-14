import Header from "./Header";

function MainLayout({ children }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#F6F3EE",
                padding: "40px"
            }}
        >
            <Header />

            {children}
        </div>
    );
}

export default MainLayout;