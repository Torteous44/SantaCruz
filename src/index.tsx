import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { preloadPhotos } from "./utils/preloader";
import { checkHealth } from "./utils/healthCheck";

// Start preloading photos immediately
preloadPhotos().catch((err) => {
  console.error("Failed to preload photos:", err);
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Perform health check before mounting the app
checkHealth()
  .then((healthData) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("Failed to start application:", error);
    // You might want to show an error message to the user here
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
