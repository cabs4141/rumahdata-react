import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "@/App.jsx";
import { AppWrapper } from "@/components/atoms/PageMeta.jsx";
import { ThemeProvider } from "@/context/ThemeContext.jsx";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Warna utama disesuaikan dengan hero card Dashboard (Tailwind blue-700 = #1D4ED8)
const muiTheme = createTheme({
  palette: {
    primary: {
      light: "#3B82F6",   // blue-500
      main: "#1D4ED8",    // blue-700 — sesuai from-blue-700 di hero banner Dashboard
      dark: "#1E40AF",    // blue-800
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

const container = document.getElementById("root");

// Tambahkan pengecekan null, karena createRoot() membutuhkan HTMLElement yang valid
if (container) {
  createRoot(container).render(
    <StrictMode>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ThemeProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ThemeProvider>
      </MuiThemeProvider>
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element with ID 'root'");
}
