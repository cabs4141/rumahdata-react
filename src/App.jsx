import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import LineChart from "./pages/Charts/LineChart";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Ptk from "./pages/DataPage/Ptk";
import Sekolah from "./pages/DataPage/Sekolah";
import Dashboard from "./pages/Dashboard/Dashboard";
import Kegiatan from "./pages/Kegiatan/Kegiatan";

export default function App() {
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
    </>
  );
}
