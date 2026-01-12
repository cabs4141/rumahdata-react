import * as React from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../../stores/useUserStore";
import { jwtDecode } from "jwt-decode";
import { Box, Typography, Modal, Button, Stack, Menu, MenuItem, Avatar, Divider, Paper } from "@mui/material";

// Icons (Pilih yang bergaya Line/Outline untuk kesan bersih)
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BadgeIcon from "@mui/icons-material/Badge";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  p: 0, // Header akan memiliki warna sendiri
  borderRadius: "2px",
  overflow: "hidden",
  outline: "none",
};

const UserDropdown = () => {
  const navigate = useNavigate();
  const { token, logout } = useUserStore();
  const [userInfo, setUserInfo] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenModal = () => {
    handleCloseMenu();
    setOpenModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/signin");
  };

  React.useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch (error) {
        logout();
        navigate("/signin");
      }
    }
  }, [token, logout, navigate]);

  return (
    <Box sx={{ display: { xs: "none", lg: "block" } }}>
      {/* Tombol Profile Navbar - Dibuat lebih solid */}
      <Box
        onClick={handleOpenMenu}
        sx={{
          bgcolor: "rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          py: 0.5,
          px: 1,
          borderRadius: "4px",
          transition: "0.2s",
          "&:hover": { bgcolor: "rgba(0,0,0,0.10)" },
        }}
      >
        <Avatar
          variant="rounded" // Bentuk kotak dengan sudut melengkung lebih formal daripada lingkaran sempurna
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#1976d2", // Biru Dongker Formal
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {userInfo?.nama?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ lineHeight: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "#333" }}>
            {userInfo?.nama?.toUpperCase() || "USER"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: 1 }}>
            {userInfo?.role || "STAFF"}
          </Typography>
        </Box>
        <ArrowDropDownIcon sx={{ color: "#999" }} />
      </Box>

      {/* Menu Dropdown - Bergaya Sidebar Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        disableScrollLock
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            width: 280,
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
          },
        }}
      >
        {/* Header Identitas di dalam Dropdown */}
        <Box sx={{ px: 2, py: 2, bgcolor: "#f8f9fa" }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "#000000", textTransform: "uppercase" }}>
            Profil
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ py: 1 }}>
          <MenuItem sx={{ py: 1, cursor: "default", "&:hover": { bgcolor: "transparent" } }}>
            <BadgeIcon sx={{ mr: 2, color: "#757575", fontSize: 20 }} />
            <Box>
              <Typography variant="caption" display="block" color="text.secondary">
                NIP
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {userInfo?.nip || "-"}
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem sx={{ py: 1, cursor: "default", "&:hover": { bgcolor: "transparent" } }}>
            <VerifiedUserIcon sx={{ mr: 2, color: "#757575", fontSize: 20 }} />
            <Box>
              <Typography variant="caption" display="block" color="text.secondary">
                Hak Akses
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                {userInfo?.role || "-"}
              </Typography>
            </Box>
          </MenuItem>
        </Box>

        <Divider />

        <MenuItem
          onClick={handleOpenModal}
          sx={{
            py: 1.5,
            color: "#d32f2f",
            "&:hover": { bgcolor: "#fff5f5" },
          }}
        >
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography variant="body2" fontWeight={700}>
            KELUAR
          </Typography>
        </MenuItem>
      </Menu>

      {/* --- MODAL KONFIRMASI (Government Style) --- */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          {/* Header Modal Berwarna */}
          <Box sx={{ bgcolor: "primary.main", p: 2, color: "white" }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Konfirmasi
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: "#444", mb: 4, lineHeight: 1.6 }}>
              Apakah Anda yakin ingin mengakhiri sesi dan keluar dari portal BGTK?
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setOpenModal(false)} sx={{ color: "#666", textTransform: "none", fontWeight: 600 }}>
                Batal
              </Button>
              <Button
                variant="contained"
                onClick={confirmLogout}
                sx={{
                  bgcolor: "#d32f2f",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#b71c1c" },
                }}
              >
                Keluar
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserDropdown;
