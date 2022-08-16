import Layout from "./components/layout/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import NewReport from "./pages/NewReport";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FhirAuthoriser />} />
        <Route path="/add_report" element={<NewReport />} />
        {/* Oauth setup with new report url so redirect this to the existing page */}
        <Route path="/new_report" element={<Navigate to="/add_report" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
