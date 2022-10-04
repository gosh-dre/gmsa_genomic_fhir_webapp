import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import NewReport from "./pages/NewReport";
import Results from "./pages/Results";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FhirAuthoriser />} />
        <Route path="/new_report" element={<NewReport />} />
        <Route path="/results_list" element={<Results />} />
      </Routes>
    </Layout>
  );
}

export default App;
