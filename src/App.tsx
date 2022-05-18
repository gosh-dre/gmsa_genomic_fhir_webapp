import React from 'react';
import Layout from "./components/layout/Layout";
import {Route, Routes} from "react-router-dom";
import NewReport from "./pages/NewReport";
import FhirAuthoriser from "./components/fhir/FhirAuthoriser";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FhirAuthoriser />}/>
        <Route path="/add_report" element={<NewReport/>}/>
      </Routes>
    </Layout>
  );
}

export default App;
