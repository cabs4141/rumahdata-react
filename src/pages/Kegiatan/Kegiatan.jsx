// Kegiatan.jsx
import { useMemo, useCallback, useState, useEffect } from "react";
import DataTable from "../DataPage/DataTable.jsx";
import { useKegiatanStore } from "../../stores/useKegiatanStore.js";
import { useNotificationStore } from "../../stores/useNotifStore";
import { useShallow } from "zustand/react/shallow";
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Backdrop, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../../stores/useUserStore";
import KegiatanDetailDrawer from "./KegiatanDetailDrawer.jsx";

const Kegiatan = () => {
  const {
    isFetching,
    kegiatanData,
    isLoading,
    totalPages,
    currentPage,
    currentLimit,
    getKegiatan,
    insertKegiatan,
    currentQuery,
    kegiatanStatistik,
    filters,
    setFilters,
    getStatistikKegiatan,
  } = useKegiatanStore(
    useShallow((state) => ({
      isFetching: state.isFetching,
      kegiatanData: state.kegiatanData,
      isLoading: state.isLoading,
      totalPages: state.totalPages,
      currentPage: state.currentPage,
      currentLimit: state.currentLimit,
      getKegiatan: state.getKegiatan,
      insertKegiatan: state.insertKegiatan,
      currentQuery: state.currentQuery,
    }))
  );

  const { showNotification } = useNotificationStore();
  const { token, permissions } = useUserStore();
  const decoded = token ? jwtDecode(token) : null;
  const userRole = decoded?.role;
  const userPermissions = Array.isArray(permissions) ? permissions : [];
  const canInsert = userRole === "admin" || userRole === "super_admin" || userPermissions.includes("kegiatan") || userPermissions.includes(2);

  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  // ── Modal Form State ──────────────────────────────────────────
  const [openForm, setOpenForm] = useState(false);
  const emptyForm = {
    nama_kegiatan: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    penanggung_jawab: "",
    tim: "",
    tahun: "",
    sasaran_peserta: "",
    total_peserta: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.nama_kegiatan || !formData.tanggal_mulai || !formData.tanggal_selesai) {
      showNotification("Nama kegiatan, tanggal mulai, dan tanggal selesai wajib diisi", "warning");
      return;
    }
    if (Number(formData.total_peserta) > Number(formData.sasaran_peserta)) {
      showNotification("Total peserta tidak boleh melebihi sasaran peserta", "warning");
      return;
    }
    setFormLoading(true);
    try {
      await insertKegiatan(formData);
      showNotification("Kegiatan berhasil ditambahkan!", "success");
      setOpenForm(false);
      setFormData(emptyForm);
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || "Gagal menambahkan kegiatan", "error");
    } finally {
      setFormLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────────────

  const columns = useMemo(
    () => [
      {
        header: "NO",
        accessor: "no",
        render: (row, index) => (
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
            {(currentPage - 1) * currentLimit + index + 1}
          </Typography>
        ),
      },
      { header: "NAMA KEGIATAN", accessor: "nama_kegiatan" },
      { header: "TANGGAL MULAI", accessor: "tanggal_mulai" },
      { header: "TANGGAL SELESAI", accessor: "tanggal_selesai" },
      { header: "PENANGGUNG JAWAB", accessor: "penanggung_jawab" },
      { header: "TIM", accessor: "tim" },
      { header: "TAHUN", accessor: "tahun" },
      { header: "SASARAN PESERTA", accessor: "sasaran_peserta" },
      { header: "TOTAL PESERTA", accessor: "total_peserta" },
      { header: "DIBUAT OLEH", accessor: "created_by" },
      { header: "TANGGAL DIBUAT", accessor: "created_at", hide: true },
    ],
    [currentPage, currentLimit]
  );

  const handleFetch = useCallback(
    (query, page, limit) => {
      getKegiatan({ query, page, limit });
    },
    [getKegiatan]
  );

  return (
    <>
      {/* Loading backdrop for insert/delete/upload */}
      <Backdrop
        open={isLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: "column", gap: 2, backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6">Mohon Tunggu...</Typography>
      </Backdrop>

      <div className="w-full max-w-full flex flex-col h-[calc(100vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
        <DataTable
          isFetching={isFetching}
          columns={columns}
          dataTitle={"Data Kegiatan"}
          data={kegiatanData}
          totalPages={totalPages}
          isLoading={false}
          currentLimit={currentLimit}
          currentPage={currentPage}
          onFetch={handleFetch}
          initialSearch={currentQuery}
          onRowClick={(row) => setSelectedKegiatan(row)}
          extraActions={
            canInsert && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setOpenForm(true)}
                sx={{ textTransform: "none" }}
                color="success"
              >
                TAMBAH KEGIATAN
              </Button>
            )
          }
        />
      </div>

      <KegiatanDetailDrawer
        kegiatan={selectedKegiatan}
        onClose={() => setSelectedKegiatan(null)}
      />

      {/* ── Modal Form Tambah Kegiatan ──────────────────────────── */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Kegiatan</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                label="Nama Kegiatan"
                name="nama_kegiatan"
                value={formData.nama_kegiatan}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tanggal Mulai"
                name="tanggal_mulai"
                type="date"
                value={formData.tanggal_mulai}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tanggal Selesai"
                name="tanggal_selesai"
                type="date"
                value={formData.tanggal_selesai}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Penanggung Jawab"
                name="penanggung_jawab"
                value={formData.penanggung_jawab}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Tim"
                name="tim"
                value={formData.tim}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Tahun"
                name="tahun"
                type="number"
                value={formData.tahun}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Sasaran Peserta"
                name="sasaran_peserta"
                type="number"
                value={formData.sasaran_peserta}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Total Peserta"
                name="total_peserta"
                type="number"
                value={formData.total_peserta}
                onChange={handleFormChange}
                fullWidth
                size="small"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenForm(false)} disabled={formLoading}>
            Batal
          </Button>
          <Button variant="contained" onClick={handleFormSubmit} disabled={formLoading}>
            {formLoading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Kegiatan;
