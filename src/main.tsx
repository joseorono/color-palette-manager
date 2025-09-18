import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { isElectron } from "./lib/electron-detector";

const getRouter = () => {
  if (isElectron()) {
    console.info("📦 Using HashRouter for Electron");
    return HashRouter;
  }

  console.info("🌐 Using BrowserRouter for production web");
  return BrowserRouter;
};

const Router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
