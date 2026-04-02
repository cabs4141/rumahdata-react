import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Divider,
  Avatar,
  Stack,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import MapIcon from "@mui/icons-material/Map";
import BusinessIcon from "@mui/icons-material/Business";
import GavelIcon from "@mui/icons-material/Gavel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useSekolahStore } from "@/features/sekolah/stores/useSekolahStore";

const ModalDetailSekolah = ({ open, handleClose }) => {
  const {
    sekolahDetail = {},
    getSekolahDetail,
    isFetchingMorePtk,
  } = useSekolahStore();
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderInfoItem = (label, value) => (
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

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;
    if (
      bottom &&
      !isFetchingMorePtk &&
      sekolahDetail?.page < sekolahDetail?.totalPages
    ) {
      getSekolahDetail(sekolahDetail.sekolah_id, sekolahDetail.page + 1, 10);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
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
              <SchoolIcon />
            </Avatar>
            <Box>
              <Stack direction="row" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {sekolahDetail?.sekolah_terpilih}
                </Typography>
              </Stack>
              {/* <Stack direction="row" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Email: {sekolahDetail?.email}
                </Typography>
              </Stack> */}
              <Stack direction="row" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  NPSN: {sekolahDetail?.npsn}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                {/* <MapIcon fontSize="small" color="action" /> */}
                <Typography variant="caption" color="text.secondary">
                  Alamat Jalan: {sekolahDetail?.alamat}
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
              label="Fasilitas & Infrastruktur"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
            <Tab
              label={`Daftar PTK (${sekolahDetail?.totalData || 0})`}
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
          </Tabs>
        </Box>

        <Box
          sx={{
            p: 3,
            pt: 2,
            minHeight: "400px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
          onScroll={activeTab === 3 ? handleScroll : undefined}
        >
          {/* TAB 1: PROFIL & IDENTITAS */}
          {activeTab === 0 && (
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

          {/* TAB 2: ALAMAT & KONTAK */}
          {activeTab === 1 && (
            <Box>
              <SectionCard icon={<LocationOnIcon fontSize="small" />} title="Detail Lokasi & Wilayah">
                <Grid item xs={12}>{renderInfoItem("Alamat Jalan", sekolahDetail?.alamat_jalan)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("RT / RW", `${sekolahDetail?.rt || "-"} / ${sekolahDetail?.rw || "-"}`)}</Grid>
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

          {/* TAB 3: FASILITAS & INFRASTRUKTUR */}
          {activeTab === 2 && (
            <Box>
              <SectionCard icon={<ElectricBoltIcon fontSize="small" />} title="Kelistrikan">
                <Grid item xs={12} sm={4}>{renderInfoItem("Sumber Listrik", sekolahDetail?.sumber_listrik || sekolahDetail?.listrik_sumber)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Daya Listrik", sekolahDetail?.daya_listrik || sekolahDetail?.listrik_daya)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Kontinuitas", sekolahDetail?.kontinuitas_listrik || sekolahDetail?.listrik_kontinuitas)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Jarak Listrik", sekolahDetail?.jarak_listrik)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Status Sambungan", sekolahDetail?.listrik_status_sambungan)}</Grid>
                <Grid item xs={12} sm={12}>{renderInfoItem("ID Pelanggan / No Meter", `${sekolahDetail?.listrik_id_pelanggan || "-"} / ${sekolahDetail?.listrik_nomor_meter || "-"}`)}</Grid>
              </SectionCard>

              <SectionCard icon={<NetworkCheckIcon fontSize="small" />} title="Internet & Jaringan">
                <Grid item xs={12} sm={4}>{renderInfoItem("Akses Internet Utama", sekolahDetail?.akses_internet)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Akses Internet Cadangan", sekolahDetail?.akses_internet_2)}</Grid>
                <Grid item xs={12} sm={4}>{renderInfoItem("Internet Provider", sekolahDetail?.internet_provider)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Jenis Layanan / Koneksi", `${sekolahDetail?.internet_jenis_layanan || "-"} / ${sekolahDetail?.internet_jenis_koneksi || "-"}`)}</Grid>
                <Grid item xs={12} sm={6}>{renderInfoItem("Bandwidth (Up/Down)", `${sekolahDetail?.internet_bandwidth_up || "-"} / ${sekolahDetail?.internet_bandwidth_down || "-"}`)}</Grid>
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

          {/* TAB 4: DAFTAR PTK */}
          {activeTab === 3 && (
            <List disablePadding>
              {sekolahDetail?.data_ptk?.map((ptk, index) => (
                <React.Fragment key={ptk.ptk_id}>
                  <ListItem sx={{ py: 2, "&:hover": { bgcolor: "#fcfcfc" } }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: "#f0f2f5",
                          color: "primary.main",
                          fontWeight: 700,
                        }}
                      >
                        {ptk.nama.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700 }}
                        >
                          {ptk.nama}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="column" spacing={0.5} sx={{ mt: 1 }}>
                          <Box
                            component="div"
                            sx={{
                              typography: "caption",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              color: "text.primary",
                              fontWeight: 600,
                            }}
                          >
                            <BadgeIcon
                              sx={{ fontSize: 14, color: "primary.main" }}
                            />
                            <span style={{ color: "gray" }}>NIP:</span>{" "}
                            {ptk.nip || "-"}
                          </Box>
                          <Box
                            component="div"
                            sx={{
                              typography: "caption",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              ml: 0.2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 14,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  bgcolor: "text.disabled",
                                  borderRadius: "50%",
                                }}
                              />
                            </Box>
                            <span style={{ color: "gray" }}>Jenis PTK:</span>
                            <Chip
                              label={ptk.jenis_ptk}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: "9px",
                                fontWeight: 700,
                                bgcolor: "primary.light",
                                color: "white",
                                ml: 0.5,
                              }}
                            />
                          </Box>
                          <Box
                            component="div"
                            sx={{
                              typography: "caption",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              ml: 0.2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 14,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  bgcolor: "text.disabled",
                                  borderRadius: "50%",
                                }}
                              />
                            </Box>
                            <span style={{ color: "gray" }}>Jabatan PTK:</span>{" "}
                            {ptk.jabatan_ptk || "-"}
                          </Box>
                          <Box
                            component="div"
                            sx={{
                              typography: "caption",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.8,
                              ml: 0.2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 14,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  bgcolor: "text.disabled",
                                  borderRadius: "50%",
                                }}
                              />
                            </Box>
                            <span style={{ color: "gray" }}>
                              Status Kepegawaian:
                            </span>{" "}
                            {ptk.status_kepegawaian || "-"}
                          </Box>
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < sekolahDetail.data_ptk.length - 1 && (
                    <Divider component="li" />
                  )}
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

export default ModalDetailSekolah;
