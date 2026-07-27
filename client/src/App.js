import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import ProjectAnalytics from "./pages/ProjectAnalytics";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/projects/:id"
                    element={<Workspace />}
                />

                <Route
                    path="/projects/:id/analytics"
                    element={<ProjectAnalytics />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
