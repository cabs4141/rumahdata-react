import { useState, useRef, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    Avatar,
    IconButton,
    Divider,
    Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";
import ImageIcon from "@mui/icons-material/Image";
import { useSettingsStore } from "@/features/settings/stores/useSettingsStore";
import { useNotificationStore } from "@/stores/useNotifStore";
import { useDeskripsiStore } from "@/features/deskripsi/stores/useDeskripsiStore";

const PersonalizationTab = () => {
    const { siteTitle, siteSubtitle, logoUrl, siteTitleColor, siteSubtitleColor, saveAll, updateLogo, resetDefaults } =
        useSettingsStore();
    const { showNotification } = useNotificationStore();
    const { deskripsi, getDeskripsi, updateDeskripsi, isLoading: isDeskripsiLoading } = useDeskripsiStore();

    const [formTitle, setFormTitle] = useState(siteTitle);
    const [formSubtitle, setFormSubtitle] = useState(siteSubtitle);
    const [formTitleColor, setFormTitleColor] = useState(siteTitleColor);
    const [formSubtitleColor, setFormSubtitleColor] = useState(siteSubtitleColor);
    const [previewLogo, setPreviewLogo] = useState(logoUrl);
    const [formDeskripsi, setFormDeskripsi] = useState(deskripsi);
    const [logoFile, setLogoFile] = useState(null);
    const fileInputRef = useRef(null);

    // Sync from store when store changes externally (e.g. reset)
    useEffect(() => {
        setFormTitle(siteTitle);
        setFormSubtitle(siteSubtitle);
        setFormTitleColor(siteTitleColor);
        setFormSubtitleColor(siteSubtitleColor);
        setPreviewLogo(logoUrl);
        setFormDeskripsi(deskripsi);
    }, [siteTitle, siteSubtitle, siteTitleColor, siteSubtitleColor, logoUrl, deskripsi]);

    useEffect(() => {
        getDeskripsi();
    }, [getDeskripsi]);

    const handleLogoSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            showNotification("File harus berupa gambar (PNG, JPG, SVG)", "error");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification("Ukuran file maksimal 2MB", "error");
            return;
        }

        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreviewLogo(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            if (logoFile) {
                await updateLogo(logoFile);
            }
            if (formDeskripsi !== deskripsi) {
                await updateDeskripsi(formDeskripsi);
            }
            saveAll({
                siteTitle: formTitle,
                siteSubtitle: formSubtitle,
                siteTitleColor: formTitleColor,
                siteSubtitleColor: formSubtitleColor,
            });
            setLogoFile(null);
            showNotification("Pengaturan berhasil disimpan!", "success");
        } catch (err) {
            showNotification("Gagal menyimpan pengaturan", "error");
        }
    };

    const handleReset = () => {
        resetDefaults();
        setLogoFile(null);
        showNotification("Pengaturan dikembalikan ke default", "info");
    };

    const hasChanges =
        formTitle !== siteTitle ||
        formSubtitle !== siteSubtitle ||
        formTitleColor !== siteTitleColor ||
        formSubtitleColor !== siteSubtitleColor ||
        logoFile !== null ||
        formDeskripsi !== deskripsi;

    return (
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                {/* --- FORM SECTION --- */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        p: 4,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Pengaturan Brand
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Ubah identitas visual website Anda. Perubahan akan terlihat di
                        sidebar dan header.
                    </Typography>

                    <Stack spacing={3}>
                        {/* Logo Upload */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Logo
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    src={previewLogo}
                                    variant="rounded"
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        bgcolor: "grey.100",
                                        border: "2px dashed",
                                        borderColor: "grey.300",
                                    }}
                                >
                                    <ImageIcon sx={{ fontSize: 32, color: "grey.400" }} />
                                </Avatar>
                                <Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<CloudUploadIcon />}
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{ textTransform: "none", mb: 0.5 }}
                                    >
                                        Upload Logo
                                    </Button>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        PNG, JPG, atau SVG. Max 2MB.
                                    </Typography>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleLogoSelect}
                                    />
                                </Box>
                            </Stack>
                        </Box>

                        {/* Title */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                            <TextField
                                label="Judul Website"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                fullWidth
                                size="small"
                                placeholder="Contoh: RUMAH DATA"
                                helperText="Teks utama yang tampil di sidebar"
                            />
                            <TextField
                                label="Warna Judul"
                                type="color"
                                value={formTitleColor}
                                onChange={(e) => setFormTitleColor(e.target.value)}
                                size="small"
                                sx={{ width: { xs: "100%", sm: 120 } }}
                            />
                        </Stack>

                        {/* Subtitle */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                            <TextField
                                label="Subtitle"
                                value={formSubtitle}
                                onChange={(e) => setFormSubtitle(e.target.value)}
                                fullWidth
                                size="small"
                                placeholder="Contoh: BGTK NTB"
                                helperText="Teks kecil di bawah judul"
                            />
                            <TextField
                                label="Warna Sub"
                                type="color"
                                value={formSubtitleColor}
                                onChange={(e) => setFormSubtitleColor(e.target.value)}
                                size="small"
                                sx={{ width: { xs: "100%", sm: 120 } }}
                            />
                        </Stack>
                        
                        {/* Deskripsi */}
                        <Box>
                            <TextField
                                label="Deskripsi Dashboard"
                                value={formDeskripsi}
                                onChange={(e) => setFormDeskripsi(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                size="small"
                                placeholder="Masukkan deskripsi untuk ditampilkan di halaman Dashboard..."
                                helperText="Teks ini akan ditampilkan di halaman depan dashboard"
                            />
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    {/* Actions */}
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<RestartAltIcon />}
                            onClick={handleReset}
                            sx={{ textTransform: "none" }}
                        >
                            Reset ke Default
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={!hasChanges}
                            sx={{ textTransform: "none" }}
                        >
                            Simpan Perubahan
                        </Button>
                    </Stack>
                </Paper>

                {/* --- LIVE PREVIEW SECTION --- */}
                <Paper
                    elevation={0}
                    sx={{
                        width: { xs: "100%", md: 280 },
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "grey.50",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ mb: 2, color: "text.secondary", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: 1 }}
                    >
                        Live Preview
                    </Typography>

                    {/* Sidebar preview */}
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                            bgcolor: "white",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 1.5, display: "block", fontWeight: 600 }}
                        >
                            Sidebar Header
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Avatar
                                src={previewLogo}
                                variant="rounded"
                                sx={{ width: 38, height: 38 }}
                            >
                                <ImageIcon />
                            </Avatar>
                            <Box>
                                <Typography
                                    sx={{
                                        color: formTitleColor || "#1976d2",
                                        fontWeight: 800,
                                        fontSize: "0.85rem",
                                        lineHeight: 1.2,
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {formTitle || "RUMAH DATA"}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: formSubtitleColor || "#9ca3af",
                                        fontSize: "0.6rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {formSubtitle || "BGTK NTB"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Mobile header preview */}
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "white",
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 1.5, display: "block", fontWeight: 600 }}
                        >
                            Mobile Header
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar
                                src={previewLogo}
                                variant="rounded"
                                sx={{ width: 32, height: 32 }}
                            >
                                <ImageIcon />
                            </Avatar>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        color: formTitleColor || "text.primary",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {formTitle || "Rumah Data"}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.65rem",
                                        fontWeight: 600,
                                        color: formSubtitleColor || "text.secondary",
                                    }}
                                >
                                    {formSubtitle || "BGTK NTB"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {hasChanges && (
                        <Alert severity="info" sx={{ mt: 2, fontSize: "0.75rem" }}>
                            Ada perubahan yang belum disimpan
                        </Alert>
                    )}
                </Paper>
            </Stack>
        </Box>
    );
};

export default PersonalizationTab;
