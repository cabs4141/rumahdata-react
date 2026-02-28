import * as React from "react";
import { Button, Dialog, Divider, AppBar, Toolbar, IconButton, Typography, Slide, CircularProgress, Box, MenuItem, Select, FormControl, InputLabel, Paper, Stack, Avatar, Grid, Chip, OutlinedInput, Checkbox, ListItemText } from "@mui/material";
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
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useUserStore } from "../../stores/useUserStore";
import { useNotificationStore } from "../../stores/useNotifStore";
import { useShallow } from "zustand/react/shallow";
import ModalConfirm from "./Modal";
import { useState, useEffect } from "react";

const PERMISSION_OPTIONS = [
  { id: 1, label: "PTK", value: "ptk" },
  { id: 2, label: "KEGIATAN", value: "kegiatan" },
  { id: 6, label: "SEKOLAH", value: "sekolah" },
  { id: 7, label: "PPG", value: "ppg" },
  { id: 8, label: "PEMETAAN KOMPETENSI", value: "pemetaan_kompetensi" }
];

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
  const { selectedUser, loading, editUser, deleteUser } = useUserStore(
    useShallow((state) => ({
      selectedUser: state.selectedUser,
      loading: state.loading,
      editUser: state.editUser,
      deleteUser: state.deleteUser,
    }))
  );
  const { showNotification } = useNotificationStore();
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role || "user");
      if (Array.isArray(selectedUser.permissions)) {
        setPermissions(selectedUser.permissions);
      } else {
        setPermissions([]);
      }
    }
  }, [selectedUser]);

  const handlePermissionsChange = (event) => {
    const {
      target: { value },
    } = event;
    setPermissions(typeof value === "string" ? value.split(",") : value);
  };

  const isTargetAdmin = selectedUser?.role === "admin";
  const canEdit = !isTargetAdmin;

  const isRoleChanged = selectedUser && role !== selectedUser.role;
  const isPermissionsChanged = selectedUser && JSON.stringify([...permissions].sort()) !== JSON.stringify([...(selectedUser.permissions || [])].sort());
  const isChanged = isRoleChanged || isPermissionsChanged;

  const handleAction = async () => {
    if (!canEdit) return;
    try {
      const permissionIds = permissions.map(val => {
        const opt = PERMISSION_OPTIONS.find(o => o.value === val);
        return opt ? opt.id : null;
      }).filter(Boolean);

      const payload = { role: role, permissions: permissionIds };
      await editUser(selectedUser.id, payload);
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
        <AppBar sx={{ position: "relative", bgcolor: isTargetAdmin ? "#2c3e50" : "primary.main", elevation: 0 }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1, fontWeight: 700 }} variant="h6">
              Profil Pengguna
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
                  <Chip label={selectedUser.role?.toUpperCase()} size="small" color={isTargetAdmin ? "error" : "primary"} sx={{ fontWeight: 700, borderRadius: 1 }} />

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
              {isTargetAdmin ? (
                <div></div>
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ p: 2.5, bgcolor: "grey.50", borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", display: 'block', mb: 1.5, letterSpacing: 0.5 }}>
                      Akses Data yang Dimiliki
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip label="DASHBOARD" size="small" color="default" variant="outlined" sx={{ fontWeight: 600, bgcolor: 'white' }} />
                      <Chip label="SPLIT DATA" size="small" color="default" variant="outlined" sx={{ fontWeight: 600, bgcolor: 'white' }} />
                      <Chip label="STATISTIK" size="small" color="default" variant="outlined" sx={{ fontWeight: 600, bgcolor: 'white' }} />
                      {Array.isArray(selectedUser.permissions) && selectedUser.permissions.map((perm, index) => {
                        const isObj = typeof perm === 'object' && perm !== null;
                        const pVal = isObj ? (perm.name || perm.value) : perm;
                        const pId = isObj ? (perm.id || perm.permission_id) : Number(perm);

                        const opt = PERMISSION_OPTIONS.find(o => o.value === pVal || o.id === pId);
                        if (!opt) return null;
                        return (
                          <Chip
                            key={index}
                            label={opt.label}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600, bgcolor: 'white' }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* ADMINISTRATIVE CONTROL PANEL */}
            {canEdit ? (
              <Paper
                variant="outlined"
                sx={{
                  mt: 4,
                  p: 3,
                  bgcolor: "#f8faff",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "primary.100",
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: "primary.main", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1 }}>
                  Kontrol Administrator
                </Typography>

                <Grid container spacing={3} alignItems="flex-start" justifyContent={"space-between"}>
                  {/* Kolom Kiri: Ubah Role dan Akses */}
                  <Grid flex={1} item xs={12} sm={7}>
                    <Stack spacing={2.5}>
                      <FormControl fullWidth size="small" sx={{ bgcolor: "white" }}>
                        <InputLabel>Hak Akses</InputLabel>
                        <Select value={role} label="Hak Akses" onChange={(e) => setRole(e.target.value)}>
                          <MenuItem value="user">User </MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>

                      {role === "user" && (
                        <FormControl fullWidth size="small" sx={{ bgcolor: "white" }}>
                          <InputLabel>Izin Akses Data</InputLabel>
                          <Select
                            multiple
                            value={permissions}
                            onChange={handlePermissionsChange}
                            input={<OutlinedInput label="Izin Akses Data" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((val) => (
                                  <Chip key={val} label={PERMISSION_OPTIONS.find(o => o.value === val)?.label || val} size="small" color="primary" variant="outlined" />
                                ))}
                              </Box>
                            )}
                          >
                            {PERMISSION_OPTIONS.map((perm) => (
                              <MenuItem key={perm.id} value={perm.value}>
                                <Checkbox checked={permissions.indexOf(perm.value) > -1} />
                                <ListItemText primary={perm.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      {isChanged && (
                        <Button variant="contained" fullWidth onClick={() => handleAction()} startIcon={<SaveIcon />} sx={{ mt: 1, py: 1, textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}>
                          Simpan Perubahan
                        </Button>
                      )}
                    </Stack>
                  </Grid>

                  {/* Kolom Kanan: Aksi Hapus */}
                  <Grid item xs={12} sm={5}>
                    <Stack spacing={1}>

                      <Button variant="outlined" color="error" fullWidth onClick={handleModal} startIcon={<DeleteForeverSharp />}>
                        Hapus User
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <div></div>
            )}
          </Box>
        ) : null}
      </Dialog>
    </>
  );
};

export default ModalDetailUser;
