import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import SpreadsheetView from "../components/workspace/SpreadsheetView";

function Workspace() {

    const { id } = useParams();

    return (

        <MainLayout>

            <h1>Project #{id}</h1>

            <WorkspaceLayout>

                 <SpreadsheetView projectId={id} />

            </WorkspaceLayout>

        </MainLayout>

    );

}

export default Workspace;