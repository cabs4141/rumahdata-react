import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router";
import AppLayout from "@/layout/AppLayout";
import { ScrollToTop } from "@/components/atoms/ScrollToTop";
import { Alert, Snackbar, Box, CircularProgress } from "@mui/material";
import { useNotificationStore } from "@/stores/useNotifStore";
import Ppg from "@/features/ppg/components/PpgList";
import { useUserStore } from "@/features/users/stores/useUserStore";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ requiredPermission, adminOnly }) => {
  const { token, permissions = [], logout } = useUserStore();

  if (!token) return <Navigate to="/signin" replace />;

  let userRole = null;
  try {
    const decoded = jwtDecode(token);

    // Check if the token has expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      logout();
      return <Navigate to="/signin" replace />;
    }

    userRole = decoded.role;
  } catch (error) {
    logout();
    return <Navigate to="/signin" replace />;
  }

  if (userRole === "admin") return <Outlet />;

  if (adminOnly && userRole !== "admin") return <Navigate to="/" replace />;
  if (requiredPermission && !permissions.includes(requiredPermission)) return <Navigate to="/" replace />;

  return <Outlet />;
};

// Lazy Load Pages
const SignIn = lazy(() => import("@/pages/AuthPages/SignIn"));

const NotFound = lazy(() => import("@/pages/OtherPage/NotFound"));
const LineChart = lazy(() => import("@/pages/Charts/LineChart"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const Settings = lazy(() => import("@/features/settings/components/Settings"));
const Ptk = lazy(() => import("@/features/ptk/components/PtkList"));
const Sekolah = lazy(() => import("@/features/sekolah/components/SekolahList"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Kegiatan = lazy(() => import("@/features/kegiatan/components/Kegiatan"));
const KegiatanStatistik = lazy(() => import("@/features/kegiatan/components/KegiatanStatistik"));
const Statistik = lazy(() => import("@/pages/DataPage/Statistik/Statistik"));
const SplitData = lazy(() => import("@/pages/DataPage/SplitData/SplitData"));
const User = lazy(() => import("@/features/users/components/User"));
const Pemetaan = lazy(() => import("@/pages/Pemetaan/Pemetaan"));

// Loading Component
const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const App = () => {
  const { open, message, severity, hideNotification } = useNotificationStore();
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route index path="/" element={<Dashboard />} />

                {/* Others Page */}
                <Route path="/kalender" element={<Calendar />} />
                <Route path="/split-data" element={<SplitData />} />
                <Route path="/statistik" element={<Statistik />} />

                {/* Charts */}
                <Route path="/line-chart" element={<LineChart />} />
              </Route>

              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/pengaturan" element={<Settings />} />
                <Route path="/user" element={<User />} />
              </Route>

              {/* data */}
              <Route element={<ProtectedRoute requiredPermission="sekolah" />}>
                <Route path="/sekolah" element={<Sekolah />} />
              </Route>

              <Route element={<ProtectedRoute requiredPermission="ptk" />}>
                <Route path="/ptk" element={<Ptk />} />
              </Route>

              <Route element={<ProtectedRoute requiredPermission="ppg" />}>
                <Route path="/ppg" element={<Ppg />} />
              </Route>

              <Route element={<ProtectedRoute requiredPermission="kegiatan" />}>
                <Route path="/kegiatan" element={<Kegiatan />} />
                <Route path="/kegiatan/statistik" element={<KegiatanStatistik />} />
              </Route>

              <Route element={<ProtectedRoute requiredPermission="pemetaan_kompetensi" />}>
                <Route path="/pemetaan" element={<Pemetaan />} />
              </Route>
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />


            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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
