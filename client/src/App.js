import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";

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

            </Routes>

        </BrowserRouter>

    );

}

export default App;