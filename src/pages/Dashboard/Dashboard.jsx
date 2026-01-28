import React, { useEffect } from "react";
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { usePtkStore } from "../../stores/usePtkStore";
import { useShallow } from "zustand/react/shallow";
import { useSekolahStore } from "../../stores/useSekolahStore";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const { ptkData, fetchPtk } = usePtkStore(
    useShallow((state) => ({
      ptkData: state.ptkData,
      fetchPtk: state.fetchPtk,
    })),
  );

  const { sekolahData, fetchSekolah } = useSekolahStore(
    useShallow((state) => ({
      sekolahData: state.sekolahData,
      fetchSekolah: state.fetchSekolah,
    })),
  );

  const { userList, getUserLists, token } = useUserStore(
    useShallow((state) => ({
      userList: state.userList,
      getUserLists: state.getUserLists,
      token: state.token,
    })),
  );

  // sepasi gtkpg 2026
  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchPtk();
    fetchSekolah();
    getUserLists();
  }, [token, navigate, fetchSekolah, getUserLists]);

  const totalPtk = ptkData?.totalData?.toLocaleString("id-ID") || 0;
  const totalUser = userList?.filter((user) => user.status === "pending").length;
  const totalSekolah = sekolahData?.totalData?.toLocaleString("id-ID") || 0;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 3,
          mb: 3,
        }}
      >
        <StatCard title="Data Sekolah" value={totalSekolah} icon={<HomeIcon fontSize="large" />} color="linear-gradient(135deg, #2e7d32, #66bb6a)" />
        <StatCard title="Data PTK" value={totalPtk} icon={<PeopleIcon fontSize="large" />} color="linear-gradient(135deg, #1976d2, #42a5f5)" />
        <StatCard title="Menunggu Approval" value={totalUser} icon={<HourglassBottomIcon fontSize="large" />} color="linear-gradient(135deg, #ed6c02, #ffb74d)" />
      </Box>
    </Box>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card
      sx={{
        height: 130,
        color: "#fff",
        background: color,
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.25)",
              p: 1.5,
              borderRadius: 2,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
