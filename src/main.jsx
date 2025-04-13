import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DataProvider } from "./context/DataContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="font-poppins bg-blue-900">
            <App />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
