import Header from "./Header";

function MainLayout({ children }) {

    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "#F6F3EE",
                overflow: "hidden"
            }}
        >

            <div
                style={{
                    padding: "10px 16px 0",
                    flexShrink: 0
                }}
            >
                <Header />
            </div>

            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    padding: "10px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    overflowX: "hidden"
                }}
            >
                {children}
            </div>

        </div>

    );

}

export default MainLayout;