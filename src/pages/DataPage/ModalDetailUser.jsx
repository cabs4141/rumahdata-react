import * as React from "react";
import { Button, Dialog, Divider, AppBar, Toolbar, IconButton, Typography, Slide, CircularProgress, Box, MenuItem, Select, FormControl, InputLabel, Paper, Stack, Avatar, Grid, Chip } from "@mui/material";
// Icons
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import HttpsIcon from "@mui/icons-material/Https";
import DeleteForeverSharp from "@mui/icons-material/DeleteForeverSharp";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShieldIcon from "@mui/icons-material/Shield";
import { useUserStore } from "../../stores/useUserStore";
import { useNotificationStore } from "../../stores/useNotifStore";
import { useShallow } from "zustand/react/shallow";
import ModalConfirm from "./Modal";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InfoItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
    <Avatar sx={{ bgcolor: "grey.100", color: "text.secondary", width: 40, height: 40 }}>{icon}</Avatar>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

const ModalDetailUser = ({ isOpen, handleClose, onRefresh }) => {
  const { selectedUser, loading, approveUser, deleteUser } = useUserStore(
    useShallow((state) => ({
      selectedUser: state.selectedUser,
      loading: state.loading,
      approveUser: state.approveUser,
      deleteUser: state.deleteUser,
    }))
  );
  const { showNotification } = useNotificationStore();
  const [role, setRole] = useState("");
  const [openModal, setOpenModal] = useState(false);

  React.useEffect(() => {
    if (selectedUser?.role) setRole(selectedUser.role);
  }, [selectedUser]);

  const isSuperAdmin = selectedUser?.role === "super_admin";
  const isRoleChanged = selectedUser && role !== selectedUser.role;

  const handleAction = async (targetStatus) => {
    if (isSuperAdmin) return;
    try {
      const payload = { id_user: selectedUser.id, status: targetStatus, role: role };
      await approveUser(payload);
      showNotification("Perubahan berhasil disimpan", "success");
      if (onRefresh) onRefresh();
    } catch (error) {
      showNotification("Gagal memproses perubahan", "error");
    }
  };

  const handleModal = () => {
    setOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      showNotification("User berhasil dihapus", "success");
      setOpenModal(false);
      handleClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      showNotification("Gagal menghapus user", "error");
      setOpenModal(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalConfirm titleHead={"Hapus User"} title={` Apakah Anda yakin ingin menghapus user ini dari sistem ?`} open={openModal} onClose={() => setOpenModal(false)} onConfirm={handleDelete} />
      <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose} TransitionComponent={Transition} PaperProps={{ sx: { borderRadius: 1 } }}>
        <AppBar sx={{ position: "relative", bgcolor: isSuperAdmin ? "#2c3e50" : "primary.main", elevation: 0 }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1, fontWeight: 700 }} variant="h6">
              {isSuperAdmin ? "Profil" : "Manajemen User"}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
            <CircularProgress />
          </Box>
        ) : selectedUser ? (
          <Box sx={{ p: 3 }}>
            {/* HEADER SECTION */}
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: "2rem", fontWeight: "bold" }}>{selectedUser.nama?.charAt(0)}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {selectedUser.nama}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label={selectedUser.role?.toUpperCase()} size="small" color={isSuperAdmin ? "error" : "primary"} sx={{ fontWeight: 700, borderRadius: 1 }} />
                  <Chip
                    icon={selectedUser.status === "approved" ? <CheckCircleIcon /> : <PendingIcon />}
                    label={selectedUser.status === "approved" ? "AKTIF" : "PENDING"}
                    size="small"
                    color={selectedUser.status === "approved" ? "success" : "warning"}
                    sx={{ fontWeight: 700, borderRadius: 1 }}
                  />
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* INFO GRID */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoItem icon={<BadgeIcon />} label="NIP" value={selectedUser.nip || "-"} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem icon={<CalendarTodayIcon />} label="Bergabung Sejak" value={selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"} />
              </Grid>
            </Grid>

            {/* ADMINISTRATIVE CONTROL PANEL */}
            {!isSuperAdmin ? (
              <Paper
                variant="outlined"
                sx={{
                  mt: 3,
                  p: 2.5,
                  bgcolor: "#f8faff",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "primary.light",
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: "primary.main", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1 }}>
                  Kontrol Administrator
                </Typography>

                <Grid container spacing={2} alignItems="flex-start" justifyContent={"space-between"}>
                  {/* Kolom Kiri: Ubah Role */}
                  <Grid flex={1} item xs={12} sm={5}>
                    <FormControl fullWidth size="small" sx={{ bgcolor: "white" }}>
                      <InputLabel>Hak Akses</InputLabel>
                      <Select value={role} label="Hak Akses" onChange={(e) => setRole(e.target.value)}>
                        <MenuItem value="user">User </MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                    {isRoleChanged && (
                      <Button variant="contained" fullWidth onClick={() => handleAction(selectedUser.status)} startIcon={<SaveIcon />} sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}>
                        Simpan
                      </Button>
                    )}
                  </Grid>

                  {/* Kolom Kanan: Aksi Status & Hapus */}
                  <Grid item xs={12} sm={7}>
                    <Stack spacing={1}>
                      {/* Tombol Aktif/Nonaktif */}
                      {selectedUser.status === "approved" ? (
                        <Button variant="outlined" color="error" fullWidth onClick={() => handleAction("pending")} startIcon={<BlockIcon />}>
                          Nonaktifkan Akun
                        </Button>
                      ) : (
                        <Button variant="outlined" color="success" fullWidth onClick={() => handleAction("approved")} startIcon={<CheckCircleIcon />}>
                          Aktifkan Akun
                        </Button>
                      )}

                      {/* Tombol Hapus - Diberi sedikit jarak atau gaya berbeda */}
                      <Button variant="outlined" color="error" fullWidth onClick={handleModal} startIcon={<DeleteForeverSharp />}>
                        Hapus User
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Box sx={{ mt: 3, p: 2, bgcolor: "#fff3e0", borderRadius: 2, border: "1px dashed #ff9800", display: "flex", alignItems: "center", gap: 2 }}>
                <HttpsIcon color="warning" />
                <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 500 }}>
                  Akun ini dilindungi sistem dan tidak dapat dimodifikasi.
                </Typography>
              </Box>
            )}
          </Box>
        ) : null}
      </Dialog>
    </>
  );
};

export default ModalDetailUser;
