import * as React from "react";
import { Button, Dialog, ListItemText, List, Divider, AppBar, Toolbar, IconButton, Typography, Slide, CircularProgress, Box, ListItem, MenuItem, Select, FormControl, InputLabel, Paper, Stack } from "@mui/material";
// Icons
import LocalPoliceTwoToneIcon from "@mui/icons-material/LocalPoliceTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending"; // Icon Pending
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // Icon Dot untuk status
import { useUserStore } from "../../stores/useUserStore";
import { useNotificationStore } from "../../stores/useNotifStore";
import HttpsIcon from "@mui/icons-material/Https";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalDetailUser = ({ isOpen, handleClose, onRefresh }) => {
  const { selectedUser, loading, approveUser } = useUserStore();
  const { showNotification } = useNotificationStore();
  const [role, setRole] = React.useState("");

  React.useEffect(() => {
    if (selectedUser?.role) {
      setRole(selectedUser.role);
    }
  }, [selectedUser]);

  const isSuperAdmin = selectedUser?.role === "super_admin";
  const isRoleChanged = selectedUser && role !== selectedUser.role;

  const handleAction = async (targetStatus) => {
    if (isSuperAdmin) return;
    try {
      const payload = {
        id_user: selectedUser.id,
        status: targetStatus,
        role: role,
      };
      await approveUser(payload);
      showNotification("Perubahan berhasil disimpan", "success");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.log(error);
      showNotification("Gagal memproses perubahan", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog fullWidth={"lg"} open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: "relative", bgcolor: isSuperAdmin ? "#2c3e50" : "primary.main" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            {isSuperAdmin ? "Detail Akun" : "Manajemen Akun"}
          </Typography>
        </Toolbar>
      </AppBar>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : selectedUser ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <List sx={{ flexGrow: 1 }}>
            <ListItem>
              <ListItemText primary="Nama Lengkap" secondary={selectedUser.nama || "-"} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="NIP" secondary={selectedUser.nip || "-"} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Status Akun"
                secondary={
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    {selectedUser.status === "approved" ? (
                      <>
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          AKTIF
                        </Typography>
                      </>
                    ) : (
                      <>
                        <PendingIcon sx={{ fontSize: 16, color: "warning.main" }} />
                        <Typography variant="body2" color="warning.main" fontWeight="bold">
                          MENUNGGU PERSETUJUAN
                        </Typography>
                      </>
                    )}
                  </Stack>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Hak Akses"
                secondary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FiberManualRecordIcon sx={{ fontSize: 10, color: isSuperAdmin ? "error.main" : "primary.main" }} />
                    <Typography variant="body2">{selectedUser.role?.toUpperCase()}</Typography>
                  </Stack>
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Tanggal Bergabung" secondary={selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString("id-ID") : "-"} />
            </ListItem>
          </List>

          {/* PANEL KONTROL DALAM SATU ROW */}
          {!isSuperAdmin ? (
            <Paper elevation={3} sx={{ p: 2, m: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                {/* Bagian Kiri: Role Selector */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Role</InputLabel>
                    <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>

                  {isRoleChanged && (
                    <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={() => handleAction(selectedUser.status)}>
                      Simpan Role
                    </Button>
                  )}
                </Stack>

                {/* Bagian Kanan: Toggle Status */}
                <Box>
                  {selectedUser.status === "approved" ? (
                    <Button variant="outlined" color="error" startIcon={<BlockIcon />} onClick={() => handleAction("pending")}>
                      Nonaktifkan Akun
                    </Button>
                  ) : (
                    <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleAction("approved")}>
                      Aktifkan
                    </Button>
                  )}
                </Box>
              </Stack>
            </Paper>
          ) : (
            <Box sx={{ p: 2, m: 2, bgcolor: "#f5f5f5", borderRadius: 1, textAlign: "center", border: "1px dashed grey" }}>
              <Stack justifyContent={"center"} direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <HttpsIcon />
                <Typography alignItems={"center"} variant="caption" color="text.secondary">
                  Akun Super Admin diproteksi sistem.
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      ) : null}
    </Dialog>
  );
};

export default ModalDetailUser;
