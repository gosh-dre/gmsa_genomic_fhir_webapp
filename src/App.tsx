import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import NewReport from "./pages/NewReport";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";
import AuthRedirect from "./components/fhir/AuthRedirect";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FhirAuthoriser />} />
        <Route path="/add_report" element={<NewReport />} />
        {/* Oauth2 setup currently only works with this url */}
        <Route path="/recv_redirect" element={<AuthRedirect />} />
      </Routes>
    </Layout>
  );
}

export default App;
