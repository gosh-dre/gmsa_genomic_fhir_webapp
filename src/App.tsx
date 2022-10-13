import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import NewReport from "./pages/NewReport";
import Results from "./pages/Results";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";
import { FhirProvider } from "./components/fhir/FhirContext";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FhirAuthoriser />} />
        <Route
          path="/new_report"
          element={
            <FhirProvider>
              <NewReport />
            </FhirProvider>
          }
        />
        <Route
          path="/results_list"
          element={
            <FhirProvider>
              <Results />
            </FhirProvider>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
