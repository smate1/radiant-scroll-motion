
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('Main.tsx executing - starting application');

const root = document.getElementById("root");
if (!root) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('Root element found, creating React root');

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app successfully mounted');
} catch (error) {
  console.error('Error mounting React app:', error);
}
