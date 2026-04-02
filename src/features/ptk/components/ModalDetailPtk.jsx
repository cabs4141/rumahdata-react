import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Stack,
  IconButton,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const ModalDetailPtk = ({ open, handleClose, ptkDetail = {} }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderInfoItem = (label, value) => (
    <Box
      sx={{
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
        "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{
          display: "block",
          mb: 0.5,
          lineHeight: 1.2,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: value ? "text.primary" : "text.disabled",
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );

  const SectionCard = ({ icon, title, children }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid #eee",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: "primary.50",
              color: "primary.main",
              width: 36,
              height: 36,
            }}
          >
            {icon}
          </Avatar>
        }
        title={
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {title}
          </Typography>
        }
        sx={{ pb: 1, borderBottom: "1px solid #f5f5f5", bgcolor: "#fafafa" }}
      />
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Grid container spacing={1.5}>
          {children}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg" /* Made lg because of numerous fields */
      PaperProps={{ sx: { borderRadius: "6px" } }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                borderRadius: "6px",
                width: 50,
                height: 50,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box>
              <Stack direction="row" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {ptkDetail?.nama || "Detail PTK"}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  NIP: {ptkDetail?.nip || "-"}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f8f9fa" }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab
              label="Profil & Identitas"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
            <Tab
              label="Alamat & Kontak"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
            <Tab
              label="Kepegawaian & Penugasan"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
            <Tab
              label="Riwayat Jabatan & Gaji"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
            <Tab
              label="Akademik & Sertifikasi"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
            <Tab
              label="Keuangan & Fasilitas"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
          </Tabs>
        </Box>

        <Box
          sx={{
            p: 3,
            pt: 2,
            minHeight: "400px",
            maxHeight: "65vh",
            overflowY: "auto",
          }}
        >
          {/* TAB 1: PROFIL & IDENTITAS */}
          {activeTab === 0 && (
            <Box>
              <SectionCard
                icon={<PersonIcon fontSize="small" />}
                title="Identitas Diri"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Nama", ptkDetail?.nama)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("NIP", ptkDetail?.nip)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Jenis Kelamin", ptkDetail?.jenis_kelamin)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Tempat Lahir", ptkDetail?.tempat_lahir)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Tanggal Lahir", ptkDetail?.tanggal_lahir)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Agama", ptkDetail?.agama)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("NIK", ptkDetail?.nik)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("No KK", ptkDetail?.no_kk)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Kewarganegaraan",
                    ptkDetail?.kewarganegaraan,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<PersonIcon fontSize="small" />}
                title="Data Registrasi Dasar"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("ID PTK", ptkDetail?.ptk_id)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Semester", ptkDetail?.semester)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("ID Sekolah", ptkDetail?.sekolah_id)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "PTK Terdaftar ID",
                    ptkDetail?.ptk_terdaftar_id,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("NIY/NIGK", ptkDetail?.niy_nigk)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("NUPTK", ptkDetail?.nuptk)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("NUKS", ptkDetail?.nuks)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Status Data", ptkDetail?.status_data)}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<PersonIcon fontSize="small" />}
                title="Informasi Keluarga"
              >
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Nama Ibu Kandung",
                    ptkDetail?.nama_ibu_kandung,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Status Perkawinan",
                    ptkDetail?.status_perkawinan,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Nama Suami/Istri",
                    ptkDetail?.nama_suami_istri,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "NIP Suami/Istri",
                    ptkDetail?.nip_suami_istri,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Pekerjaan Suami/Istri",
                    ptkDetail?.pekerjaan_suami_istri,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Jumlah Anak", ptkDetail?.jumlah_anak)}
                </Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 2: ALAMAT & KONTAK */}
          {activeTab === 1 && (
            <Box>
              <SectionCard
                icon={<ContactMailIcon fontSize="small" />}
                title="Detail Lokasi"
              >
                <Grid item xs={12}>
                  {renderInfoItem("Alamat Jalan", ptkDetail?.alamat_jalan)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "RT / RW",
                    `${ptkDetail?.rt || "-"} / ${ptkDetail?.rw || "-"}`,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Dusun", ptkDetail?.nama_dusun)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Desa/Kelurahan", ptkDetail?.desa_kelurahan)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Kode Desa", ptkDetail?.kode_desa_kelurahan)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Kecamatan", ptkDetail?.kecamatan)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Kode Kec", ptkDetail?.kode_kecamatan)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Kabupaten", ptkDetail?.kabupaten)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Kode Kab", ptkDetail?.kode_kabupaten)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Provinsi", ptkDetail?.provinsi)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Kode Prov", ptkDetail?.kode_provinsi)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Kode Pos", ptkDetail?.kode_pos)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Koordinat",
                    `${ptkDetail?.lintang || "-"}, ${ptkDetail?.bujur || "-"}`,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<ContactMailIcon fontSize="small" />}
                title="Kontak & Komunikasi"
              >
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "No Telepon Rumah",
                    ptkDetail?.no_telepon_rumah,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Email", ptkDetail?.email)}
                </Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 3: KEPEGAWAIAN & PENUGASAN */}
          {activeTab === 2 && (
            <Box>
              <SectionCard
                icon={<WorkIcon fontSize="small" />}
                title="Informasi Kepegawaian"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Status Keaktifan",
                    ptkDetail?.status_keaktifan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Status Kepegawaian",
                    ptkDetail?.status_kepegawaian,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Jenis PTK", ptkDetail?.jenis_ptk)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Jabatan PTK", ptkDetail?.jabatan_ptk)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Pangkat Golongan",
                    ptkDetail?.pangkat_golongan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Lembaga Pengangkat",
                    ptkDetail?.lembaga_pengangkat,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("SK CPNS", ptkDetail?.sk_cpns)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Tgl CPNS", ptkDetail?.tgl_cpns)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "SK Pengangkatan",
                    ptkDetail?.sk_pengangkatan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "TMT Pengangkatan",
                    ptkDetail?.tmt_pengangkatan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("TMT PNS", ptkDetail?.tmt_pns)}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<WorkIcon fontSize="small" />}
                title="Penugasan & Keahlian Tambahan"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Pengawas Bidang Studi",
                    ptkDetail?.pengawas_bidang_studi,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Sudah Lisensi Kepsek",
                    ptkDetail?.sudah_lisensi_kepala_sekolah,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Jumlah Sekolah Binaan",
                    ptkDetail?.jumlah_sekolah_binaan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Pernah Diklat Kepengawasan",
                    ptkDetail?.pernah_diklat_kepengawasan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Keahlian Laboratorium",
                    ptkDetail?.keahlian_laboratorium,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Keahlian Braille",
                    ptkDetail?.keahlian_braille,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Keahlian Bhs Isyarat",
                    ptkDetail?.keahlian_bhs_isyarat,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Mampu Handle KK",
                    ptkDetail?.mampu_handle_kk,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<WorkIcon fontSize="small" />}
                title="Penugasan Khusus"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Tahun Ajaran", ptkDetail?.tahun_ajaran)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Nomor Surat Tugas",
                    ptkDetail?.nomor_surat_tugas,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tanggal Surat Tugas",
                    ptkDetail?.tanggal_surat_tugas,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("TMT Tugas", ptkDetail?.tmt_tugas)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("PTK Induk", ptkDetail?.ptk_induk)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Jenis Keluar", ptkDetail?.jenis_keluar)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Tgl PTK Keluar", ptkDetail?.tgl_ptk_keluar)}
                </Grid>

                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tugas Tambahan Jabatan",
                    ptkDetail?.tugas_tambahan_jabatan_ptk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tugas Tambahan Sekolah",
                    ptkDetail?.tugas_tambahan_sekolah,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tugas Tambahan Jumlah Jam",
                    ptkDetail?.tugas_tambahan_jumlah_jam,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tugas Tambahan Nomor SK",
                    ptkDetail?.tugas_tambahan_nomor_sk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tugas Tambahan TMT",
                    ptkDetail?.tugas_tambahan_tmt_tambahan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tugas Tambahan TST",
                    ptkDetail?.tugas_tambahan_tst_tambahan,
                  )}
                </Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 4: RIWAYAT JABATAN & GAJI */}
          {activeTab === 3 && (
            <Box>
              <SectionCard
                icon={<AttachMoneyIcon fontSize="small" />}
                title="Riwayat Kepangkatan"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Pangkat Golongan",
                    ptkDetail?.riwayat_kepangkatan_pangkat_golongan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Nomor SK",
                    ptkDetail?.riwayat_kepangkatan_nomor_sk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tanggal SK",
                    ptkDetail?.riwayat_kepangkatan_tanggal_sk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "TMT Pangkat",
                    ptkDetail?.riwayat_kepangkatan_tmt_pangkat,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Masa Kerja Tahun",
                    ptkDetail?.riwayat_kepangkatan_masa_kerja_gol_tahun,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Masa Kerja Bulan",
                    ptkDetail?.riwayat_kepangkatan_masa_kerja_gol_bulan,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<AttachMoneyIcon fontSize="small" />}
                title="Riwayat Gaji Berkala"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Pangkat Golongan",
                    ptkDetail?.riwayat_gaji_berkala_pangkat_golongan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Nomor SK",
                    ptkDetail?.riwayat_gaji_berkala_nomor_sk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tanggal SK",
                    ptkDetail?.riwayat_gaji_berkala_tanggal_sk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "TMT KGB",
                    ptkDetail?.riwayat_gaji_berkala_tmt_kgb,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Masa Kerja Tahun",
                    ptkDetail?.riwayat_gaji_berkala_masa_kerja_tahun,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Masa Kerja Bulan",
                    ptkDetail?.riwayat_gaji_berkala_masa_kerja_bulan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Gaji Pokok",
                    ptkDetail?.riwayat_gaji_berkala_gaji_pokok,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<AttachMoneyIcon fontSize="small" />}
                title="Riwayat Inpassing"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Pangkat Golongan",
                    ptkDetail?.inpassing_pangkat_golongan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Nomor SK",
                    ptkDetail?.inpassing_no_sk_inpassing,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tanggal SK",
                    ptkDetail?.inpassing_tgl_sk_inpassing,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "TMT Inpassing",
                    ptkDetail?.inpassing_tmt_inpassing,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Angka Kredit",
                    ptkDetail?.inpassing_angka_kredit,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Masa Kerja Tahun",
                    ptkDetail?.inpassing_masa_kerja_tahun,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Masa Kerja Bulan",
                    ptkDetail?.inpassing_masa_kerja_bulan,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<WorkIcon fontSize="small" />}
                title="Jabatan Struktural & Fungsional"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Jabatan Struktural",
                    ptkDetail?.riwayat_struktural_jabatan_ptk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "SK Struktural",
                    ptkDetail?.riwayat_struktural_sk_struktural,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "TMT Jabatan Struktural",
                    ptkDetail?.riwayat_struktural_tmt_jabatan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Jabatan Fungsional",
                    ptkDetail?.riwayat_fungsional_jabatan_fungsional,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "SK Fungsional",
                    ptkDetail?.riwayat_fungsional_sk_jabfung,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "TMT Jabatan Fungsional",
                    ptkDetail?.riwayat_fungsional_tmt_jabatan,
                  )}
                </Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 5: AKADEMIK & SERTIFIKASI */}
          {activeTab === 4 && (
            <Box>
              <SectionCard
                icon={<SchoolIcon fontSize="small" />}
                title="Pendidikan Formal"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Bidang Studi",
                    ptkDetail?.riwayat_pendidikan_formal_bidang_studi,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Jenjang",
                    ptkDetail?.riwayat_pendidikan_formal_jenjang_pendidikan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Gelar Akademik",
                    ptkDetail?.riwayat_pendidikan_formal_gelar_akademik,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Satuan Pendidikan",
                    ptkDetail?.riwayat_pendidikan_formal_satuan_pendidikan_formal,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Fakultas",
                    ptkDetail?.riwayat_pendidikan_formal_fakultas,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Kependidikan",
                    ptkDetail?.riwayat_pendidikan_formal_kependidikan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tahun Masuk",
                    ptkDetail?.riwayat_pendidikan_formal_tahun_masuk,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tahun Lulus",
                    ptkDetail?.riwayat_pendidikan_formal_tahun_lulus,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "NIM",
                    ptkDetail?.riwayat_pendidikan_formal_nim,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Status Kuliah",
                    ptkDetail?.riwayat_pendidikan_formal_status_kuliah,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Semester",
                    ptkDetail?.riwayat_pendidikan_formal_semester,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "IPK",
                    ptkDetail?.riwayat_pendidikan_formal_ipk,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<SchoolIcon fontSize="small" />}
                title="Sertifikasi"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Bidang Studi",
                    ptkDetail?.riwayat_sertifikasi_bidang_studi,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Jenis Sertifikasi",
                    ptkDetail?.riwayat_sertifikasi_jenis_sertifikasi,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Tahun Sertifikasi",
                    ptkDetail?.riwayat_sertifikasi_tahun_sertifikasi,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Nomor Sertifikat",
                    ptkDetail?.riwayat_sertifikasi_nomor_sertifikat,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("NRG", ptkDetail?.riwayat_sertifikasi_nrg)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Nomor Peserta",
                    ptkDetail?.riwayat_sertifikasi_nomor_peserta,
                  )}
                </Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 6: KEUANGAN & FASILITAS */}
          {activeTab === 5 && (
            <Box>
              <SectionCard
                icon={<AccountBalanceWalletIcon fontSize="small" />}
                title="Data Keuangan"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Sumber Gaji", ptkDetail?.sumber_gaji)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("NPWP", ptkDetail?.npwp)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Nama WP", ptkDetail?.nm_wp)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Bank", ptkDetail?.bank)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Rekening Bank", ptkDetail?.rekening_bank)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Rekening Atas Nama",
                    ptkDetail?.rekening_atas_nama,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Karpeg", ptkDetail?.karpeg)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Karpas", ptkDetail?.karpas)}
                </Grid>
              </SectionCard>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={handleClose}
          fullWidth
          variant="contained"
          sx={{ borderRadius: "3px", textTransform: "none", fontWeight: 700 }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDetailPtk;
