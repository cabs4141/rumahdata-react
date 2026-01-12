import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../../stores/useUserStore";
import { jwtDecode } from "jwt-decode";
import { Box, Grid, Typography, Paper, Stack, Divider, Button } from "@mui/material";

// Icons
import SchoolIcon from "@mui/icons-material/School";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) throw new Error("Expired");
    } catch (error) {
      logout();
      navigate("/signin");
    }
  }, [navigate, logout]);

  // Card statistik yang disesuaikan ukurannya agar pas di grid
  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        borderLeft: `6px solid ${color}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, lineHeight: 1.2, display: "block", mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ p: 1.5, bgcolor: `${color}10`, borderRadius: 2, color: color, display: "flex" }}>{icon}</Box>
      </Stack>
    </Paper>
  );

  return (
    // Box utama tanpa padding berlebih karena sudah ditangani oleh <main className="p-4"> di Layout
    <Box sx={{ width: "100%" }}>
      {/* 1. Welcoming Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a237e", letterSpacing: -0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Panel Rumah Data Balai Guru dan Tenaga Kependidikan.
        </Typography>
      </Box>

      {/* 2. Statistik Cepat - Grid responsif */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total Sekolah" value="1.240" icon={<SchoolIcon fontSize="large" />} color="#1a237e" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total PTK" value="8.562" icon={<PeopleAltIcon fontSize="large" />} color="#0288d1" />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <StatCard title="Menunggu Approval" value="12" icon={<HowToRegIcon fontSize="large" />} color="#d32f2f" />
        </Grid>
      </Grid>

      {/* 3. Baris Kedua: Aktivitas & Akses */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, minHeight: 300 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Status Sinkronisasi Sistem
            </Typography>
            <Divider />
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Data sinkron dengan server pusat Kemdikbudristek.
                <br /> Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa", height: "100%" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Akses Cepat
            </Typography>
            <Stack spacing={1}>
              {[
                { label: "Manajemen User", path: "/data-user" },
                { label: "Kelola Data Sekolah", path: "/data-sekolah" },
                { label: "Kelola Data PTK", path: "/data-ptk" },
              ].map((item) => (
                <Button
                  key={item.path}
                  variant="text"
                  fullWidth
                  onClick={() => navigate(item.path)}
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    fontWeight: 600,
                    color: "text.primary",
                    "&:hover": { bgcolor: "white", color: "primary.main" },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
