import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import NewReport from "./pages/NewReport";
import Results from "./pages/Results";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";
import { FhirProvider } from "./components/fhir/FhirContext";

function App() {
  return (
    <Layout>
      <FhirProvider>
        <Routes>
          <Route path="/" element={<FhirAuthoriser />} />
          <Route path="/new_report" element={<NewReport />} />
          <Route path="/results_list" element={<Results />} />
        </Routes>
      </FhirProvider>
    </Layout>
  );
}

export default App;
