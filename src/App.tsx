import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import NewReport from "./pages/NewReport";
import ResultsList from "./pages/ResultsList";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FhirAuthoriser />} />
        <Route path="/new_report" element={<NewReport />} />
        <Route path="/results_list" element={<ResultsList />} />
      </Routes>
    </Layout>
  );
}

export default App;
