const fs = require('fs');

const file = 'src/features/sekolah/components/ModalDetailSekolah.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard imports to include Tabs and Tab from MUI
content = content.replace(
  'import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, Divider, Avatar, Stack, IconButton, Button, List, ListItem, ListItemAvatar, ListItemText, Paper, Chip, CircularProgress } from "@mui/material";',
  'import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, Divider, Avatar, Stack, IconButton, Button, List, ListItem, ListItemAvatar, ListItemText, Paper, Chip, CircularProgress, Tabs, Tab } from "@mui/material";'
);

// Add activeTab state to the component
content = content.replace(
  'const { sekolahDetail = {}, getSekolahDetail, isFetchingMorePtk } = useSekolahStore();',
  `const { sekolahDetail = {}, getSekolahDetail, isFetchingMorePtk } = useSekolahStore();
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (event, newValue) => { setActiveTab(newValue); };`
);

// We define a helper block for rendering key-value items clearly
content = content.replace(
  '  const handleScroll = (e) => {',
  `  const renderInfoItem = (label, value) => (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.2 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, color: value ? 'text.primary' : 'text.disabled' }}>{value || "-"}</Typography>
    </Box>
  );

  const handleScroll = (e) => {`
);

// We replace the DialogContent completely to add the Tab header and tab contents logically separated
const newDialogContent = `
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f8f9fa' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ px: 2 }}>
            <Tab label="Profil & Identitas" sx={{ fontWeight: 600, textTransform: 'none' }} />
            <Tab label="Alamat & Kontak" sx={{ fontWeight: 600, textTransform: 'none' }} />
            <Tab label="Fasilitas & Infrastruktur" sx={{ fontWeight: 600, textTransform: 'none' }} />
            <Tab label={\`Daftar PTK (\${sekolahDetail?.totalData || 0})\`} sx={{ fontWeight: 600, textTransform: 'none' }} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3, pt: 2, minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }} onScroll={activeTab === 3 ? handleScroll : undefined}>
          {/* TAB 1: PROFIL & IDENTITAS */}
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Informasi Umum</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Nama Sekolah", sekolahDetail?.nama)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Nama Nomenklatur", sekolahDetail?.nama_nomenklatur)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("NPSN", sekolahDetail?.npsn)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("NSS", sekolahDetail?.nss)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Bentuk Pendidikan", sekolahDetail?.bentuk_pendidikan)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Jenjang", sekolahDetail?.jenjang)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Status Sekolah", sekolahDetail?.status_sekolah)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Status Kepemilikan", sekolahDetail?.status_kepemilikan)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Yayasan", sekolahDetail?.yayasan)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("MBS", sekolahDetail?.mbs)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Akreditasi", sekolahDetail?.akreditasi)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Angkatan PSP", sekolahDetail?.angkatan_psp)}</Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Divider />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', my: 2 }}>Perizinan & Legalitas</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("SK Pendirian", sekolahDetail?.sk_pendirian_sekolah)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Tgl SK Pendirian", sekolahDetail?.tanggal_sk_pendirian)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("SK Izin Operasional", sekolahDetail?.sk_izin_operasional)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Tgl SK Izin Operasional", sekolahDetail?.tanggal_sk_izin_operasional)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("NPWP", sekolahDetail?.npwp)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Nama WP", sekolahDetail?.nm_wp)}</Grid>
            </Grid>
          )}

          {/* TAB 2: ALAMAT & KONTAK */}
          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Detail Lokasi & Wilayah</Typography>
              </Grid>
              <Grid item xs={12}>{renderInfoItem("Alamat Jalan", sekolahDetail?.alamat_jalan)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("RT / RW", \`\${sekolahDetail?.rt || "-"} / \${sekolahDetail?.rw || "-"}\`)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Dusun", sekolahDetail?.nama_dusun)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Desa / Kelurahan", sekolahDetail?.desa_kelurahan)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Kecamatan", sekolahDetail?.kecamatan)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Kabupaten", sekolahDetail?.kabupaten)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Provinsi", sekolahDetail?.provinsi)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Kode Pos", sekolahDetail?.kode_pos)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Lintang", sekolahDetail?.lintang)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Bujur", sekolahDetail?.bujur)}</Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Divider />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', my: 2 }}>Kontak & Komunikasi</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Nomor Telepon", sekolahDetail?.nomor_telepon)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Nomor Fax", sekolahDetail?.nomor_fax)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Email", sekolahDetail?.email)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Website", sekolahDetail?.website)}</Grid>
            </Grid>
          )}

          {/* TAB 3: FASILITAS & INFRASTRUKTUR */}
          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>Kelistrikan</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Sumber Listrik", sekolahDetail?.sumber_listrik || sekolahDetail?.listrik_sumber)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Daya Listrik", sekolahDetail?.daya_listrik || sekolahDetail?.listrik_daya)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Kontinuitas", sekolahDetail?.kontinuitas_listrik || sekolahDetail?.listrik_kontinuitas)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Jarak Listrik", sekolahDetail?.jarak_listrik)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Status Sambungan", sekolahDetail?.listrik_status_sambungan)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("ID Pelanggan / No Meter", \`\${sekolahDetail?.listrik_id_pelanggan || "-"} / \${sekolahDetail?.listrik_nomor_meter || "-"}\`)}</Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Divider />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', my: 2 }}>Internet & Jaringan</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Akses Internet Utama", sekolahDetail?.akses_internet)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Akses Internet Cadangan", sekolahDetail?.akses_internet_2)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Internet Provider", sekolahDetail?.internet_provider)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Jenis Layanan / Koneksi", \`\${sekolahDetail?.internet_jenis_layanan || "-"} / \${sekolahDetail?.internet_jenis_koneksi || "-"}\`)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Bandwidth (Up/Down)", \`\${sekolahDetail?.internet_bandwidth_up || "-"} / \${sekolahDetail?.internet_bandwidth_down || "-"}\`)}</Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Divider />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', my: 2 }}>Bangunan & Rekening Bank</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Luas Tanah Milik", sekolahDetail?.luas_tanah_milik)}</Grid>
              <Grid item xs={12} sm={6}>{renderInfoItem("Luas Tanah Bukan Milik", sekolahDetail?.luas_tanah_bukan_milik)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Nama Bank", sekolahDetail?.nama_bank)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("No Rekening", sekolahDetail?.no_rekening)}</Grid>
              <Grid item xs={12} sm={4}>{renderInfoItem("Rekening Atas Nama", sekolahDetail?.rekening_atas_nama)}</Grid>
            </Grid>
          )}

          {/* TAB 4: DAFTAR PTK */}
          {activeTab === 3 && (
            <List disablePadding>
              {sekolahDetail?.data_ptk?.map((ptk, index) => (
                <React.Fragment key={ptk.ptk_id}>
                  <ListItem sx={{ py: 2, "&:hover": { bgcolor: "#fcfcfc" } }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#f0f2f5", color: "primary.main", fontWeight: 700 }}>{ptk.nama.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {ptk.nama}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="column" spacing={0.5} sx={{ mt: 1 }}>
                          <Box component="div" sx={{ typography: 'caption', display: "flex", alignItems: "center", gap: 0.8, color: "text.primary", fontWeight: 600 }}>
                            <BadgeIcon sx={{ fontSize: 14, color: "primary.main" }} />
                            <span style={{ color: "gray" }}>NIP:</span> {ptk.nip || "-"}
                          </Box>
                          <Box component="div" sx={{ typography: 'caption', display: "flex", alignItems: "center", gap: 0.8, ml: 0.2 }}>
                            <Box sx={{ width: 14, display: "flex", justifyContent: "center" }}>
                              <Box sx={{ width: 4, height: 4, bgcolor: "text.disabled", borderRadius: "50%" }} />
                            </Box>
                            <span style={{ color: "gray" }}>Jenis PTK:</span>
                            <Chip label={ptk.jenis_ptk} size="small" sx={{ height: 18, fontSize: "9px", fontWeight: 700, bgcolor: "primary.light", color: "white", ml: 0.5 }} />
                          </Box>
                          <Box component="div" sx={{ typography: 'caption', display: "flex", alignItems: "center", gap: 0.8, ml: 0.2 }}>
                            <Box sx={{ width: 14, display: "flex", justifyContent: "center" }}>
                              <Box sx={{ width: 4, height: 4, bgcolor: "text.disabled", borderRadius: "50%" }} />
                            </Box>
                            <span style={{ color: "gray" }}>Jabatan PTK:</span> {ptk.jabatan_ptk || "-"}
                          </Box>
                          <Box component="div" sx={{ typography: 'caption', display: "flex", alignItems: "center", gap: 0.8, ml: 0.2 }}>
                            <Box sx={{ width: 14, display: "flex", justifyContent: "center" }}>
                              <Box sx={{ width: 4, height: 4, bgcolor: "text.disabled", borderRadius: "50%" }} />
                            </Box>
                            <span style={{ color: "gray" }}>Status Kepegawaian:</span> {ptk.status_kepegawaian || "-"}
                          </Box>
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < sekolahDetail.data_ptk.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
              {isFetchingMorePtk && (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </List>
          )}
        </Box>
      </DialogContent>
`;

content = content.replace(/<DialogContent dividers>[\s\S]*?<\/DialogContent>/, newDialogContent);

fs.writeFileSync(file, content);
console.log('ModalDetailSekolah patched structure safely.');
