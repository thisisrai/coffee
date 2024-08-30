import React from "react";
import ReactDom from "react-dom";
import "./styles.css";
import { App } from "./components/App";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AppState } from "./AppState.jsx";

import "./styles.css";

const root = createRoot(document.querySelector("#root"));
root.render(
  <AppState>
    <Router>
      <App />
      <App />
    </Router>
  </AppState>
);
);
