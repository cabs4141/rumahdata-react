import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Alert,
    LinearProgress,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon, InsertDriveFile as FileIcon } from "@mui/icons-material";
import { useUserStore } from "../../../stores/useUserStore";

const SplitData = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { token } = useUserStore();

    const onDrop = useCallback((acceptedFiles) => {
        // Only accept one file
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setSuccess(false);
            setUploadProgress(0);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "text/csv": [".csv"],
            "application/csv": [".csv"]
        },
        maxFiles: 1,
    });

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setSuccess(false);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/splitsdata/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    responseType: "blob", // Important for downloading the zip file
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "split_results.zip"); // Filename from backend response or default
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSuccess(true);
            setFile(null); // Reset file after successful upload
        } catch (err) {
            console.error("Upload error:", err);
            // Try to read the blob error message if possible
            if (err.response && err.response.data instanceof Blob) {
                const text = await err.response.data.text();
                try {
                    const json = JSON.parse(text);
                    setError(json.message || json.error || "Gagal memproses file.");
                } catch (e) {
                    setError("Terjadi kesalahan saat memproses file.");
                }
            } else {
                setError(err.message || "Gagal mengupload file.");
            }
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="800" color="#1C2434" mb={1}>
                    Split Data
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Upload file Excel (.xlsx) atau CSV (.csv) untuk memecah data per 1000 baris menjadi file ZIP.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: "16px",
                    border: "1px solid #EFF4FB",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.03)",
                    bgcolor: "white",
                    maxWidth: 800,
                    mx: "auto",
                }}
            >
                <Box
                    {...getRootProps()}
                    sx={{
                        border: "2px dashed",
                        borderColor: isDragActive ? "primary.main" : "grey.300",
                        borderRadius: 2,
                        p: 6,
                        textAlign: "center",
                        cursor: "pointer",
                        bgcolor: isDragActive ? "action.hover" : "background.paper",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "action.hover",
                        },
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                    {isDragActive ? (
                        <Typography variant="h6" color="primary">
                            Lepaskan file di sini...
                        </Typography>
                    ) : (
                        <>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                Tarik & Lepas file di sini
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                atau klik untuk memilih file
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.disabled" }}>
                                Hanya mendukung format csv dan xlsx
                            </Typography>
                        </>
                    )}
                </Box>

                {file && (
                    <Box sx={{ mt: 3, p: 2, border: "1px solid", borderColor: "grey.200", borderRadius: 2, bgcolor: "grey.50" }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <FileIcon color="primary" />
                            <Box flexGrow={1}>
                                <Typography variant="subtitle2" noWrap>
                                    {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {(file.size / 1024).toFixed(2)} KB
                                </Typography>
                            </Box>
                            <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                                Hapus
                            </Button>
                        </Box>
                    </Box>
                )}

                {loading && (
                    <Box mt={3}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Typography variant="caption" color="text.secondary" align="center" display="block" mt={1}>
                            Mengupload & Memproses... {uploadProgress}%
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                        File berhasil diproses dan didownload!
                    </Alert>
                )}

                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        size="large"
                        disabled={!file || loading}
                        onClick={handleUpload}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                    >
                        {loading ? "Memproses..." : "Split Data"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default SplitData;
