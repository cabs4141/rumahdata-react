import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import LineChart from "./pages/Charts/LineChart";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Ptk from "./pages/DataPage/Ptk/Ptk";
import Sekolah from "./pages/DataPage/Sekolah/Sekolah";
import Dashboard from "./pages/Dashboard/Dashboard";
import Kegiatan from "./pages/Kegiatan/Kegiatan";
import User from "./pages/DataPage/User/User";
import { Alert, Snackbar } from "@mui/material";
import { useNotificationStore } from "./stores/useNotifStore";

const App = () => {
  const { open, message, severity, hideNotification } = useNotificationStore();

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Dashboard />} />

            {/* Others Page */}
            <Route path="/kalender" element={<Calendar />} />
            <Route path="/pengaturan" element={<Blank />} />
            <Route path="/user" element={<User />} />

            {/* Sekolah */}
            <Route path="/sekolah" element={<Sekolah />} />
            <Route path="/ptk" element={<Ptk />} />
            <Route path="/kegiatan" element={<Kegiatan />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      {/* Komponen Alert dengan Snackbar */}
      <Snackbar open={open} autoHideDuration={6000} onClose={hideNotification} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={hideNotification} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
