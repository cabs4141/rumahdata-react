import { Box, Typography, Grid } from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EventIcon from "@mui/icons-material/Event";
import { usePtkStore } from "../../stores/usePtkStore";
import { useShallow } from "zustand/react/shallow";
import { useSekolahStore } from "../../stores/useSekolahStore";
import { useUserStore } from "../../stores/useUserStore";
import { usePpgStore } from "../../stores/usePpgStore";
import { useKegiatanStore } from "../../stores/useKegiatanStore";
import { useNavigate } from "react-router-dom";
import KPICard from "../../components/molecules/KPICard";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo } from "react";

export default function Dashboard() {
  const navigate = useNavigate();



  const { ptkData, getPtk, totalData: ptkTotalData } = usePtkStore(
    useShallow((state) => ({
      ptkData: state.ptkData,
      getPtk: state.getPtk,
      totalData: state.totalData,
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

  const { totalPpgStatistik, getStatistikPpg } = usePpgStore(
    useShallow((state) => ({
      totalPpgStatistik: state.totalPpgStatistik,
      getStatistikPpg: state.getStatistikPpg,
    }))
  );

  const { totalData: kegiatanTotalData, fetchTotalKegiatan } = useKegiatanStore(
    useShallow((state) => ({
      totalData: state.totalData,
      fetchTotalKegiatan: state.fetchTotalKegiatan,
    }))
  );

  // Get user info from token
  const userInfo = useMemo(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded;
      } catch (error) {
        return null;
      }
    }
    return null;
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    getPtk();
    fetchSekolah();
    getUserLists();
    getStatistikPpg();
    fetchTotalKegiatan();
  }, [token, navigate, getPtk, fetchSekolah, getUserLists, getStatistikPpg, fetchTotalKegiatan]);

  const totalPtk = ptkTotalData?.toLocaleString("id-ID") || 0;
  const totalUser = userList?.filter((user) => user.status === "pending").length;
  const totalSekolah = sekolahData?.totalData?.toLocaleString("id-ID") || 0;
  const totalPpg = totalPpgStatistik?.toLocaleString("id-ID") || "-";
  const totalKegiatan = kegiatanTotalData?.toLocaleString("id-ID") || "-";

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F8FAFC', minHeight: '100vh' }}>

      {/* Welcome Section */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight="800" color="#1C2434" mb={1}>
          Dashboard
        </Typography>
        {/* <Typography variant="subtitle1" color="text.secondary">
          Selamat Datang kembali
        </Typography> */}
      </Box>

      {/* KPI Cards Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ width: { xs: '100%', sm: '300px' }, flexGrow: 0 }}>
          <KPICard
            title="Sekolah"
            value={totalSekolah}
            icon={<SchoolIcon fontSize="large" />}
            color="linear-gradient(135deg, #1E88E5 0%, #42A5F5 100%)"
            to="/sekolah"
            variant="filled"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '300px' }, flexGrow: 0 }}>
          <KPICard
            title="PTK"
            value={totalPtk}
            icon={<GroupsIcon fontSize="large" />}
            color="linear-gradient(135deg, #43A047 0%, #66BB6A 100%)"
            to="/ptk"
            variant="filled"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '300px' }, flexGrow: 0 }}>
          <KPICard
            title="PPG"
            value={totalPpg}
            icon={<WorkspacePremiumIcon fontSize="large" />}
            color="linear-gradient(135deg, #FF6F00 0%, #FFA000 100%)"
            to="/ppg"
            variant="filled"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: '300px' }, flexGrow: 0 }}>
          <KPICard
            title="Kegiatan"
            value={totalKegiatan}
            icon={<EventIcon fontSize="large" />}
            color="linear-gradient(135deg, #8E24AA 0%, #AB47BC 100%)"
            to="/kegiatan"
            variant="filled"
          />
        </Box>

      </Box>



    </Box>
  );
}
