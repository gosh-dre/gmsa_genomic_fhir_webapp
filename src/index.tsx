import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";

const GH_REPOSITORY = process.env.REACT_APP_GH_REPOSITORY;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <HashRouter basename={GH_REPOSITORY}>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
