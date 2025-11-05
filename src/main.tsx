// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext"; // <-- IMPORT

createRoot(document.getElementById("root")!).render(
  <LanguageProvider> {/* <-- WRAP YOUR APP */}
    <App />
  </LanguageProvider>
);