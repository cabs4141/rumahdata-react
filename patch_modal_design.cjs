const fs = require('fs');
const file = 'src/features/sekolah/components/ModalDetailSekolah.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update Imports
content = content.replace(
  'import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, Divider, Avatar, Stack, IconButton, Button, List, ListItem, ListItemAvatar, ListItemText, Paper, Chip, CircularProgress, Tabs, Tab } from "@mui/material";',
  'import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, Divider, Avatar, Stack, IconButton, Button, List, ListItem, ListItemAvatar, ListItemText, Paper, Chip, CircularProgress, Tabs, Tab, Card, CardContent, CardHeader } from "@mui/material";'
);

content = content.replace(
  'import MapIcon from "@mui/icons-material/Map";',
  'import MapIcon from "@mui/icons-material/Map";\\nimport BusinessIcon from "@mui/icons-material/Business";\\nimport GavelIcon from "@mui/icons-material/Gavel";\\nimport LocationOnIcon from "@mui/icons-material/LocationOn";\\nimport ContactPhoneIcon from "@mui/icons-material/ContactPhone";\\nimport ElectricBoltIcon from "@mui/icons-material/ElectricBolt";\\nimport NetworkCheckIcon from "@mui/icons-material/NetworkCheck";\\nimport AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";'
);

// 2. Update renderInfoItem to be an elegant Block
content = content.replace(
  /const renderInfoItem = \(label, value\) => \([\s\S]*?\);\n\n  const handleScroll =/m,
  `const renderInfoItem = (label, value) => (
    <Box sx={{
      bgcolor: "common.white",
      border: "1px solid",
      borderColor: "grey.200",
      p: 1.5,
      borderRadius: 1.5,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      transition: "all 0.2s",
      "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" }
    }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5, lineHeight: 1.2, fontWeight: 600, letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: value ? "text.primary" : "text.disabled", wordBreak: "break-word" }}>
        {value || "-"}
      </Typography>
    </Box>
  );

  const SectionCard = ({ icon, title, children }) => (
    <Card variant="outlined" sx={{ mb: 3, borderRadius: 2, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)", border: "1px solid #eee" }}>
      <CardHeader 
        avatar={<Avatar sx={{ bgcolor: "primary.50", color: "primary.main", width: 36, height: 36 }}>{icon}</Avatar>}
        title={<Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>{title}</Typography>}
        sx={{ pb: 1, borderBottom: "1px solid #f5f5f5", bgcolor: "#fafafa" }}
      />
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Grid container spacing={1.5}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );

  const handleScroll =`
);

// 3. Rebuild Tab 1
content = content.replace(
  /\{activeTab === 0 && \([\s\S]*?\)\}\n\n          \{\/\* TAB 2/m,
  `{activeTab === 0 && (
            <Box>
              <SectionCard icon={<BusinessIcon fontSize="small" />} title="Informasi Umum">
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Nama Sekolah", sekolahDetail?.nama)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Nama Nomenklatur", sekolahDetail?.nama_nomenklatur)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("NPSN", sekolahDetail?.npsn)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("NSS", sekolahDetail?.nss)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Bentuk Pendidikan", sekolahDetail?.bentuk_pendidikan)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Jenjang", sekolahDetail?.jenjang)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Status Sekolah", sekolahDetail?.status_sekolah)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Status Kepemilikan", sekolahDetail?.status_kepemilikan)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Yayasan", sekolahDetail?.yayasan)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("MBS", sekolahDetail?.mbs)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Akreditasi", sekolahDetail?.akreditasi)}</Grid>
                <Grid item xs={12} sm={6} md={4}>{renderInfoItem("Angkatan PSP", sekolahDetail?.angkatan_psp)}</Grid>
              </SectionCard>

              <SectionCard icon={<GavelIcon fontSize="small" />} title="Perizinan & Legalitas">
                <Grid item xs={12} sm={6}>{renderInfoItem("SK Pendirian", sekolahDetail?.sk_pendirian_sekolah)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Tgl SK Pendirian", sekolahDetail?.tanggal_sk_pendirian)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("SK Izin Operasional", sekolahDetail?.sk_izin_operasional)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Tgl SK Izin Operasional", sekolahDetail?.tanggal_sk_izin_operasional)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("NPWP", sekolahDetail?.npwp)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Nama WP", sekolahDetail?.nm_wp)}</Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 2`
);


// 4. Rebuild Tab 2
content = content.replace(
  /\{activeTab === 1 && \([\s\S]*?\)\}\n\n          \{\/\* TAB 3/m,
  `{activeTab === 1 && (
            <Box>
              <SectionCard icon={<LocationOnIcon fontSize="small" />} title="Detail Lokasi & Wilayah">
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
              </SectionCard>

              <SectionCard icon={<ContactPhoneIcon fontSize="small" />} title="Kontak & Komunikasi">
                <Grid item xs={12} sm={6}>{renderInfoItem("Nomor Telepon", sekolahDetail?.nomor_telepon)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Nomor Fax", sekolahDetail?.nomor_fax)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Email", sekolahDetail?.email)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Website", sekolahDetail?.website)}</Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 3`
);

// 5. Rebuild Tab 3
content = content.replace(
  /\{activeTab === 2 && \([\s\S]*?\)\}\n\n          \{\/\* TAB 4/m,
  `{activeTab === 2 && (
            <Box>
              <SectionCard icon={<ElectricBoltIcon fontSize="small" />} title="Kelistrikan">
                <Grid item xs={12} sm={4}>{renderInfoItem("Sumber Listrik", sekolahDetail?.sumber_listrik || sekolahDetail?.listrik_sumber)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Daya Listrik", sekolahDetail?.daya_listrik || sekolahDetail?.listrik_daya)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Kontinuitas", sekolahDetail?.kontinuitas_listrik || sekolahDetail?.listrik_kontinuitas)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Jarak Listrik", sekolahDetail?.jarak_listrik)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Status Sambungan", sekolahDetail?.listrik_status_sambungan)}</Grid>
                <Grid item xs={12} sm={12}>{renderInfoItem("ID Pelanggan / No Meter", \`\${sekolahDetail?.listrik_id_pelanggan || "-"} / \${sekolahDetail?.listrik_nomor_meter || "-"}\`)}</Grid>
              </SectionCard>

              <SectionCard icon={<NetworkCheckIcon fontSize="small" />} title="Internet & Jaringan">
                <Grid item xs={12} sm={4}>{renderInfoItem("Akses Internet Utama", sekolahDetail?.akses_internet)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Akses Internet Cadangan", sekolahDetail?.akses_internet_2)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Internet Provider", sekolahDetail?.internet_provider)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Jenis Layanan / Koneksi", \`\${sekolahDetail?.internet_jenis_layanan || "-"} / \${sekolahDetail?.internet_jenis_koneksi || "-"}\`)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Bandwidth (Up/Down)", \`\${sekolahDetail?.internet_bandwidth_up || "-"} / \${sekolahDetail?.internet_bandwidth_down || "-"}\`)}</Grid>
              </SectionCard>

              <SectionCard icon={<AccountBalanceWalletIcon fontSize="small" />} title="Aset & Perbankan">
                <Grid item xs={12} sm={6}>{renderInfoItem("Luas Tanah Milik", sekolahDetail?.luas_tanah_milik)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Luas Tanah Bukan Milik", sekolahDetail?.luas_tanah_bukan_milik)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Nama Bank", sekolahDetail?.nama_bank)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("No Rekening", sekolahDetail?.no_rekening)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Rekening Atas Nama", sekolahDetail?.rekening_atas_nama)}</Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 4`
);


fs.writeFileSync(file, content);
console.log('ModalDetailSekolah UI Premium patch successful.');
