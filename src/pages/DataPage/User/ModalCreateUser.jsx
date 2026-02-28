import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Slide, Box, TextField, Button, MenuItem, Select, FormControl, InputLabel, OutlinedInput, Checkbox, ListItemText, FormHelperText, InputAdornment, Stack, Chip, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useUserStore } from "../../../stores/useUserStore";
import { useNotificationStore } from "../../../stores/useNotifStore";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PERMISSION_OPTIONS = [
    { label: "PTK", value: "ptk" },
    { label: "KEGIATAN", value: "kegiatan" },
    { label: "SEKOLAH", value: "sekolah" },
    { label: "PPG", value: "ppg" },
    { label: "PEMETAAN KOMPETENSI", value: "pemetaan_kompetensi" }
];

const ModalCreateUser = ({ isOpen, handleClose, onRefresh }) => {
    const { createUser, loading } = useUserStore();
    const { showNotification } = useNotificationStore();

    const [payload, setPayload] = useState({
        nip: "",
        nama: "",
        password: "",
        role: "user",
        permissions: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePermissionsChange = (event) => {
        const {
            target: { value },
        } = event;
        setPayload((prev) => ({
            ...prev,
            permissions: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!payload.nip || !payload.nama || !payload.password) {
                return showNotification("NIP, Nama, dan Password wajib diisi", "error");
            }

            // If role is admin, maybe we don't need permissions, but just pass it anyway
            await createUser(payload);
            showNotification("User berhasil dibuat", "success");
            onRefresh();
            handleClose();
            // Reset form
            setPayload({ nip: "", nama: "", password: "", role: "user", permissions: [] });
        } catch (error) {
            showNotification(error?.response?.data?.message || error?.response?.data?.error || "Gagal membuat user", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose} TransitionComponent={Transition} PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}>
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Tambah User Baru
                </Typography>
                <IconButton aria-label="close" onClick={handleClose} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                            label="Nama Lengkap"
                            name="nama"
                            variant="outlined"
                            fullWidth
                            required
                            value={payload.nama}
                            onChange={handleChange}
                            placeholder="Masukkan Nama Lengkap"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="NIP"
                            name="nip"
                            variant="outlined"
                            fullWidth
                            required
                            value={payload.nip}
                            onChange={handleChange}
                            placeholder="Masukkan NIP"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            required
                            value={payload.password}
                            onChange={handleChange}
                            placeholder="Masukkan Password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">Hak Akses (Role)</InputLabel>
                            <Select
                                labelId="role-select-label"
                                name="role"
                                value={payload.role}
                                onChange={handleChange}
                                input={<OutlinedInput label="Hak Akses (Role)" />}
                                startAdornment={
                                    <InputAdornment position="start" sx={{ pl: 1 }}>
                                        <ShieldIcon color="action" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                            <FormHelperText>Pilih tingkat akses pengguna pada aplikasi.</FormHelperText>
                        </FormControl>

                        {payload.role === "user" && (
                            <FormControl fullWidth>
                                <InputLabel id="permissions-select-label">Izin Akses Data</InputLabel>
                                <Select
                                    labelId="permissions-select-label"
                                    multiple
                                    name="permissions"
                                    value={payload.permissions}
                                    onChange={handlePermissionsChange}
                                    input={<OutlinedInput label="Izin Akses Data" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" color="primary" variant="outlined" />
                                            ))}
                                        </Box>
                                    )}
                                    startAdornment={
                                        <InputAdornment position="start" sx={{ pl: 1 }}>
                                            <VpnKeyIcon color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    {PERMISSION_OPTIONS.map((perm) => (
                                        <MenuItem key={perm.value} value={perm.value}>
                                            <Checkbox checked={payload.permissions.indexOf(perm.value) > -1} />
                                            <ListItemText primary={perm.label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Tentukan modul apa saja yang dapat diakses oleh user ini.</FormHelperText>
                            </FormControl>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, bgcolor: "grey.50" }}>
                    <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 600 }}>
                        Batal
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading} sx={{ fontWeight: 600, px: 4 }}>
                        {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ModalCreateUser;
