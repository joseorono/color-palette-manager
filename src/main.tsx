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

// Defer service worker registration to after initial render
if (!isElectron() && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Delay SW registration to not block initial render
    setTimeout(() => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.info("✅ Service Worker registered");
        })
        .catch((error) => {
          console.warn("Service Worker registration failed:", error);
        });
    }, 3000); // Register after 3 seconds
  });
}
