// KegiatanDetailDrawer.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { usePesertaStore } from "@/features/pemetaan/stores/usePesertaStore";
import { useNotificationStore } from "@/stores/useNotifStore";
import { useUserStore } from "@/features/users/stores/useUserStore";
import { useKegiatanStore } from "@/features/kegiatan/stores/useKegiatanStore";
import { jwtDecode } from "jwt-decode";

const PESERTA_PER_PAGE = 10;

const KegiatanDetailDrawer = ({ kegiatan, onClose }) => {
  const open = Boolean(kegiatan);
  const { allPeserta, fetchAllPeserta, getPesertaByKegiatan, uploadPeserta, deletePeserta, isLoading, isFetching, deleteAllPeserta } = usePesertaStore();
  const { deleteKegiatanById } = useKegiatanStore();
  const { token } = useUserStore();
  const { showNotification } = useNotificationStore();

  const decoded = token ? jwtDecode(token) : null;
  const canModifyKegiatan =
    decoded?.role === "admin" ||
    (decoded?.id && (decoded.id === kegiatan?.users_id || decoded.id === kegiatan?.user_id || decoded.id === kegiatan?.id_user)) ||
    (decoded?.nama && decoded.nama === kegiatan?.created_by);

  const [page, setPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // peserta_id to confirm deletion
  const [deleteKegiatanOpen, setDeleteKegiatanOpen] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);

  // Fetch peserta when drawer opens
  useEffect(() => {
    if (open && allPeserta.length === 0) {
      fetchAllPeserta();
    }
    setPage(1);
  }, [open, kegiatan?.id]);

  const pesertaList = kegiatan ? getPesertaByKegiatan(kegiatan.id) : [];
  const totalPages = Math.ceil(pesertaList.length / PESERTA_PER_PAGE);
  const paginatedPeserta = pesertaList.slice((page - 1) * PESERTA_PER_PAGE, page * PESERTA_PER_PAGE);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setUploadFile(e.target.files[0]);
  };

  const handleUploadSubmit = useCallback(async () => {
    if (!uploadFile || !kegiatan) return;
    try {
      await uploadPeserta(uploadFile, kegiatan.id);
      showNotification("Upload peserta berhasil!", "success");
      setOpenUpload(false);
      setUploadFile(null);
      setPage(1);
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || "Gagal upload peserta", "error");
    }
  }, [uploadFile, kegiatan, uploadPeserta, showNotification]);

  const handleDeletePeserta = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deletePeserta(deleteTarget);
      showNotification("Peserta berhasil dihapus", "success");
      setDeleteTarget(null);
      if (page > 1 && paginatedPeserta.length === 1) setPage((p) => p - 1);
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || "Gagal hapus peserta", "error");
    }
  }, [deleteTarget, deletePeserta, showNotification, page, paginatedPeserta.length]);

  const handleDeleteAllPeserta = useCallback(async () => {
    if (!kegiatan) return;
    try {
      await deleteAllPeserta(kegiatan.id);
      showNotification("Berhasil hapus seluruh data peserta", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || "Gagal hapus seluruh peserta", "error");
    }
  }, [deleteAllPeserta, showNotification, kegiatan]);

  const handleDeleteKegiatan = async () => {
    if (!kegiatan) return;
    try {
      await deleteKegiatanById(kegiatan.id);
      showNotification("Kegiatan berhasil dihapus", "success");
      setDeleteKegiatanOpen(false);
      onClose();
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || "Gagal menghapus kegiatan", "error");
    }
  };

  const formatDate = (val) => {
    if (!val) return "-";
    return new Date(val).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: "100%", display: "flex", flexDirection: "column" } }}>
        {/* ── Header ───────────────────────────────────── */}
        <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
              {kegiatan?.nama_kegiatan || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              📍 {kegiatan?.tempat_pelaksanaan || "Tempat Pelaksanaan Belum Ditentukan"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📅 {formatDate(kegiatan?.tanggal_mulai)} - {formatDate(kegiatan?.tanggal_selesai)}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ mt: 0.5 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* ── Scrollable body ───────────────────────────── */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
          {/* Info Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
            {[
              { label: "Tanggal Mulai", value: formatDate(kegiatan?.tanggal_mulai) },
              { label: "Tanggal Selesai", value: formatDate(kegiatan?.tanggal_selesai) },
              { label: "Penanggung Jawab", value: kegiatan?.penanggung_jawab },
              { label: "Tim", value: kegiatan?.tim },
              { label: "Tahun", value: kegiatan?.tahun },
              { label: "Dibuat Oleh", value: kegiatan?.created_by },
              { label: "Sasaran Peserta", value: kegiatan?.sasaran_peserta },
              { label: "Total Peserta", value: kegiatan?.total_peserta },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ bgcolor: "action.hover", borderRadius: 1, px: 1.5, py: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {value || "-"}
                </Typography>
              </Box>
            ))}
          </Box>

          {canModifyKegiatan && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button variant="outlined" color="error" startIcon={<DeleteIcon />} size="small" onClick={() => setDeleteKegiatanOpen(true)} disabled={isLoading}>
                Hapus Kegiatan
              </Button>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          {/* Peserta Section Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PeopleIcon fontSize="small" color="primary" />
              <Typography variant="subtitle1" fontWeight={700}>
                Daftar Peserta
              </Typography>
              <Chip label={pesertaList.length} size="small" color="primary" />
            </Box>
            {canModifyKegiatan && (
              <div className="flex gap-2">
                <Button variant="contained" size="small" startIcon={<CloudUploadIcon />} onClick={() => setOpenUpload(true)} sx={{ textTransform: "none" }}>
                  Upload Peserta
                </Button>
                <Button color="error" variant="contained" size="small" startIcon={<DeleteIcon />} onClick={() => setDeleteAllOpen(true)} sx={{ textTransform: "none" }}>
                  Hapus Semua Peserta
                </Button>
              </div>
            )}
          </Box>

          {/* Peserta Table */}
          {isFetching ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : pesertaList.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">Belum ada peserta untuk kegiatan ini</Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["No", "Nama", "Instansi", "Kabupaten", "Jabatan", "Jenjang", "Peran", "Alamat", "Aksi"]
                        .filter((h) => h !== "Aksi" || canModifyKegiatan)
                        .map((h) => (
                          <TableCell key={h} sx={{ bgcolor: "#f5f5f5", fontWeight: "bold", whiteSpace: "nowrap" }}>
                            {h}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPeserta.map((p, idx) => (
                      <TableRow key={p.peserta_id} hover>
                        <TableCell>{(page - 1) * PESERTA_PER_PAGE + idx + 1}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{p.nama}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>{p.instansi}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{p.kabupaten}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{p.jabatan}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{p.jenjang}</TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>{p.peran}</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>{p.alamat}</TableCell>
                        {canModifyKegiatan && (
                          <TableCell>
                            <Tooltip title="Hapus peserta">
                              <IconButton size="small" color="error" onClick={() => setDeleteTarget(p.peserta_id)} disabled={isLoading}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1, mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Halaman {page} dari {totalPages}
                  </Typography>
                  <IconButton size="small" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
                    <NavigateBeforeIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
                    <NavigateNextIcon />
                  </IconButton>
                </Box>
              )}
            </>
          )}
        </Box>
      </Drawer>

      {/* ── Upload Peserta Dialog ─────────────────────── */}
      <Dialog
        open={openUpload}
        onClose={() => {
          setOpenUpload(false);
          setUploadFile(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Upload Peserta</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Upload file Excel/CSV untuk kegiatan: <strong>{kegiatan?.nama_kegiatan}</strong>
          </DialogContentText>
          <Box
            component="label"
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: "#fafafa",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: 130,
              justifyContent: "center",
              transition: "all 0.3s",
              "&:hover": { bgcolor: "#f0f7ff", borderColor: "primary.main" },
            }}
          >
            <input type="file" hidden accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
            <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
            <Typography variant="body2" fontWeight={500}>
              {uploadFile ? uploadFile.name : "Klik atau seret file ke sini"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : "Format: .xlsx / .csv"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenUpload(false);
              setUploadFile(null);
            }}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button variant="contained" onClick={handleUploadSubmit} disabled={!uploadFile || isLoading}>
            {isLoading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirm Delete Dialog ─────────────────────── */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs">
        <DialogTitle>Hapus Peserta</DialogTitle>
        <DialogContent>
          <DialogContentText>Apakah anda yakin ingin hapus peserta ini dari kegiatan?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={isLoading}>
            Batal
          </Button>
          <Button color="error" variant="contained" onClick={handleDeletePeserta} disabled={isLoading}>
            {isLoading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Confirm Delete Kegiatan Dialog ─────────────────────── */}
      <Dialog open={deleteKegiatanOpen} onClose={() => setDeleteKegiatanOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ color: "error.main" }}>Hapus Kegiatan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus kegiatan <strong>{kegiatan?.nama_kegiatan}</strong>? Semua data peserta di dalamnya akan ikut terhapus permanen.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteKegiatanOpen(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteKegiatan} disabled={isLoading}>
            {isLoading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
      {/* ── Confirm Delete ALL Peserta Dialog ─────────────────── */}
      <Dialog open={deleteAllOpen} onClose={() => setDeleteAllOpen(false)} maxWidth="xs">
        <DialogTitle sx={{ color: "error.main" }}>Hapus Seluruh Peserta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus <strong>seluruh peserta</strong> dari kegiatan <strong>{kegiatan?.nama_kegiatan}</strong>? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAllOpen(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await handleDeleteAllPeserta();
              setDeleteAllOpen(false);
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
            Ya, Hapus Semua
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KegiatanDetailDrawer;
