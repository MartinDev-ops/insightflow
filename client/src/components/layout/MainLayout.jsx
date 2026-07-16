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
                    flexShrink: 0,
                    padding: "10px 16px 0 16px"
                }}
            >

                <Header />

            </div>

            <div
                style={{
                    flex: 1,
                    padding: "10px 16px 16px 16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0
                }}
            >

                {children}

            </div>

        </div>

    );

}

export default MainLayout;