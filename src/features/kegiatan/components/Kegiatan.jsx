// Kegiatan.jsx
import { useMemo, useCallback, useState, useEffect } from "react";
import DataTable from "@/pages/DataPage/DataTable.jsx";
import { useKegiatanStore } from "@/features/kegiatan/stores/useKegiatanStore.js";
import { useNotificationStore } from "@/stores/useNotifStore";
import { useShallow } from "zustand/react/shallow";
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Backdrop, CircularProgress, Box, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DownloadIcon } from "@/icons";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "@/features/users/stores/useUserStore";
import KegiatanDetailDrawer from "@/features/kegiatan/components/KegiatanDetailDrawer.jsx";
import { useUserTeamStore } from "@/features/user_team/stores/useUserTeamStore.js";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

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

  const { userTeams, fetchUserTeams } = useUserTeamStore();

  useEffect(() => {
    fetchUserTeams();
  }, [fetchUserTeams]);

  const { showNotification } = useNotificationStore();
  const { token, permissions } = useUserStore();
  const decoded = token ? jwtDecode(token) : null;
  const userRole = decoded?.role;
  const userPermissions = Array.isArray(permissions) ? permissions : [];
  const canInsert = userRole === "admin" || userPermissions.includes("kegiatan") || userPermissions.includes(2);

  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({ tahun: "" });

  // ── Modal Form State ──────────────────────────────────────────
  const [openForm, setOpenForm] = useState(false);
  const emptyForm = {
    nama_kegiatan: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    tempat_pelaksanaan: "",
    penanggung_jawab: "",
    team_id: "",
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
    if (!formData.nama_kegiatan || !formData.tanggal_mulai || !formData.tanggal_selesai || !formData.tempat_pelaksanaan) {
      showNotification("Nama kegiatan, tanggal mulai, tanggal selesai, dan tempat pelaksanaan wajib diisi", "warning");
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
      { header: "TEMPAT PELAKSANAAN", accessor: "tempat_pelaksanaan" },
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

  // ── Logic Filter Client-Side ────────────────────────────────────
  const uniqueTahun = useMemo(() => {
    const years = new Set(kegiatanData.map((keg) => keg.tahun).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a); // descending
  }, [kegiatanData]);

  const filteredData = useMemo(() => {
    if (!currentFilters.tahun) return kegiatanData;
    return kegiatanData.filter((keg) => String(keg.tahun) === String(currentFilters.tahun));
  }, [kegiatanData, currentFilters.tahun]);

  const handleFilterChange = (newFilter) => {
    setCurrentFilters((prev) => ({ ...prev, ...newFilter }));
  };
  // ─────────────────────────────────────────────────────────────

  // ── Logic Export Data to CSV ────────────────────────────────────
  const handleExportData = () => {
    if (!filteredData || filteredData.length === 0) {
      showNotification("Tidak ada data untuk diekspor", "warning");
      return;
    }

    // Define CSV Headers
    const headers = ["No", "Nama Kegiatan", "Tanggal Mulai", "Tanggal Selesai", "Tempat Pelaksanaan", "Penanggung Jawab", "Tim", "Tahun", "Sasaran Peserta", "Total Peserta"];

    // Map Data based on FILTERED results
    const rows = filteredData.map((keg, index) => [
      index + 1,
      `"${keg.nama_kegiatan || ""}"`,
      keg.tanggal_mulai || "",
      keg.tanggal_selesai || "",
      `"${keg.tempat_pelaksanaan || ""}"`,
      `"${keg.penanggung_jawab || ""}"`,
      `"${keg.tim || ""}"`,
      keg.tahun || "",
      keg.sasaran_peserta || "",
      keg.total_peserta || "",
    ]);

    // Construct CSV String
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Kegiatan_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);

    link.click();

    // Clean up
    document.body.removeChild(link);
    showNotification("Data berhasil diekspor", "success");
  };
  // ─────────────────────────────────────────────────────────────

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
          data={filteredData}
          totalPages={totalPages}
          isLoading={false}
          currentLimit={currentLimit}
          currentPage={currentPage}
          onFetch={handleFetch}
          initialSearch={currentQuery}
          tahunOptions={uniqueTahun}
          currentFilters={currentFilters}
          onFilterChange={handleFilterChange}
          onRowClick={(row) => setSelectedKegiatan(row)}
          extraActions={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {currentFilters.tahun && (
                <Typography variant="body2" sx={{ mr: 1, color: "text.secondary", fontWeight: 500 }}>
                  Total Filter: {filteredData.length}
                </Typography>
              )}
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={handleExportData}
                sx={{ textTransform: "none", borderColor: "#E2E8F0", color: "#64748B" }}
              >
                EXPORT CSV
              </Button>
              {canInsert && (
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
              )}
            </Box>
          }
        />
      </div>

      <KegiatanDetailDrawer
        kegiatan={selectedKegiatan}
        onClose={() => setSelectedKegiatan(null)}
      />

      {/* ── Modal Form Tambah Kegiatan ──────────────────────────── */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: '#1E293B', fontSize: '1.25rem' }}>
          {formData.id ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#F8FAFC", p: { xs: 2, md: 4 } }}>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* ── INFO UTAMA ── */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" color="primary" fontWeight={700} mb={2} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Informasi Utama
              </Typography>
              <Grid container spacing={3}>
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
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Tempat Pelaksanaan"
                    name="tempat_pelaksanaan"
                    value={formData.tempat_pelaksanaan}
                    onChange={handleFormChange}
                    fullWidth
                    size="small"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
              </Grid>
            </Paper>

            {/* ── WAKTU PELAKSANAAN ── */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" color="primary" fontWeight={700} mb={2} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Waktu Pelaksanaan
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
              </Grid>
            </Paper>

            {/* ── KEPANITIAAN & TARGET PESERTA ── */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" color="primary" fontWeight={700} mb={2} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Kepanitiaan & Peserta
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="team-select-label">Tim Pengurus</InputLabel>
                    <Select
                      labelId="team-select-label"
                      id="team-select"
                      name="team_id"
                      value={formData.team_id || ""}
                      label="Tim Pengurus"
                      onChange={handleFormChange}
                    >
                      <MenuItem value="">
                        <em>Pilih Tim</em>
                      </MenuItem>
                      {userTeams.map((team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.nama_tim}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 2.5, bgcolor: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
          <Button onClick={() => setOpenForm(false)} disabled={formLoading} sx={{ fontWeight: 600, color: '#64748B' }}>
            BATAL
          </Button>
          <Button variant="contained" onClick={handleFormSubmit} disabled={formLoading} sx={{ px: 4, fontWeight: 600, borderRadius: 2 }}>
            {formLoading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
            SIMPAN
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Kegiatan;
