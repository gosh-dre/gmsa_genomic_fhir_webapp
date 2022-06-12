import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import NewReport from "./pages/NewReport";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";
import FhirProvider from "./components/fhir/FhirProvider";

function App() {
  return (
    <Layout>
      <FhirProvider>
        <Routes>
          <Route path="/" element={<FhirAuthoriser />} />
          <Route path="/add_report" element={<NewReport />} />
        </Routes>
      </FhirProvider>
    </Layout>
  );
}

export default App;
