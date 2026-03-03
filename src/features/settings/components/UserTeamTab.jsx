import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUserTeamStore } from "@/features/user_team/stores/useUserTeamStore";
import { useNotificationStore } from "@/stores/useNotifStore";

const UserTeamTab = () => {
    const { userTeams, isLoading, fetchUserTeams, insertUserTeam, updateUserTeam, deleteUserTeam } = useUserTeamStore();
    const { showNotification } = useNotificationStore();

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState("add"); // "add" | "edit"
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamName, setTeamName] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchUserTeams();
    }, [fetchUserTeams]);

    const handleOpenAdd = () => {
        setDialogMode("add");
        setTeamName("");
        setSelectedTeam(null);
        setOpenDialog(true);
    };

    const handleOpenEdit = (team) => {
        setDialogMode("edit");
        setTeamName(team.nama_tim);
        setSelectedTeam(team);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSave = async () => {
        if (!teamName.trim()) {
            showNotification("Nama tim tidak boleh kosong", "warning");
            return;
        }

        setFormLoading(true);
        try {
            if (dialogMode === "add") {
                await insertUserTeam({ nama_tim: teamName });
                showNotification("Tim berhasil ditambahkan", "success");
            } else {
                await updateUserTeam(selectedTeam.id, { nama_tim: teamName });
                showNotification("Tim berhasil diperbarui", "success");
            }
            handleCloseDialog();
        } catch (error) {
            showNotification(error.response?.data?.message || "Terjadi kesalahan", "error");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus tim ini?")) return;

        try {
            await deleteUserTeam(id);
            showNotification("Tim berhasil dihapus", "success");
        } catch (error) {
            showNotification(error.response?.data?.message || "Gagal menghapus tim", "error");
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                    Manajemen Tim
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAdd}
                    sx={{ textTransform: "none" }}
                    size="small"
                >
                    Tambah Tim
                </Button>
            </Box>

            {isLoading && userTeams.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List sx={{ bgcolor: "background.paper", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    {userTeams.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="Belum ada data tim." sx={{ color: "text.secondary", textAlign: "center" }} />
                        </ListItem>
                    ) : (
                        userTeams.map((team, index) => (
                            <div key={team.id}>
                                <ListItem>
                                    <ListItemText primary={team.nama_tim} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEdit(team)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(team.id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < userTeams.length - 1 && <Divider />}
                            </div>
                        ))
                    )}
                </List>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <DialogTitle>
                    {dialogMode === "add" ? "Tambah Tim Baru" : "Edit Nama Tim"}
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nama Tim"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        disabled={formLoading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={formLoading}>Batal</Button>
                    <Button onClick={handleSave} variant="contained" disabled={formLoading}>
                        {formLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserTeamTab;
