import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.jsx";
import { AppWrapper } from "./components/common/PageMeta.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const container = document.getElementById("root");

// Tambahkan pengecekan null, karena createRoot() membutuhkan HTMLElement yang valid
if (container) {
  createRoot(container).render(
    <StrictMode>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element with ID 'root'");
}
