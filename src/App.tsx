import React from 'react';
import './App.css';
import Layout from "./components/layout/Layout";
import {Navigate, Route, Routes} from "react-router-dom";
import NewReport from "./pages/NewReport";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/add_report" replace/>}/>
        <Route path="/add_report" element={<NewReport/>}/>
      </Routes>
    </Layout>
  );
}

export default App;
