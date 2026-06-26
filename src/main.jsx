/**
 * main.jsx — React entry point
 *
 * This is the first JavaScript file that runs.
 * Its only job is to find the <div id="root"> in index.html
 * and tell React to render our App component inside it.
 *
 * You will almost never need to edit this file.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode helps catch bugs during development.
  // It runs certain checks twice in dev mode — this is expected behaviour.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

