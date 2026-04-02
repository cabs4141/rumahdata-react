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

import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const ModalDetailPpg = ({ open, handleClose, ppgDetail = {} }) => {
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
              <PersonIcon />
            </Avatar>
            <Box>
              <Stack direction="row" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {ppgDetail?.nama_lengkap || "Detail Peserta PPG"}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  No UKG: {ppgDetail?.no_ukg || "-"}
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
              label="Data Pribadi & Kesediaan"
              sx={{ fontWeight: 600, textTransform: "none" }}
            />
            <Tab
              label="Asal Sekolah & LPTK"
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
          {/* TAB 1: Data Pribadi & Kesediaan */}
          {activeTab === 0 && (
            <Box>
              <SectionCard
                icon={<PersonIcon fontSize="small" />}
                title="Identitas Calon Mahasiswa"
              >
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("No UKG", ppgDetail?.no_ukg)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Tahun", ppgDetail?.tahun)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Nama Lengkap", ppgDetail?.nama_lengkap)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("No HP", ppgDetail?.no_hp)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Tahap", ppgDetail?.tahap)}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<AssignmentTurnedInIcon fontSize="small" />}
                title="Status & Konfirmasi Kesediaan"
              >
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Status Kesediaan",
                    ppgDetail?.status_kesediaan,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Waktu Isi", ppgDetail?.waktu_isi_kesediaan)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem("Alasan", ppgDetail?.alasan)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Status Plotting",
                    ppgDetail?.status_plotting,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Email Konfirmasi",
                    ppgDetail?.email_konfirmasi,
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderInfoItem(
                    "Status Konfirmasi Email",
                    ppgDetail?.status_konfirmasi_email,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Waktu Konfirmasi Email",
                    ppgDetail?.waktu_konfirmasi_email,
                  )}
                </Grid>
              </SectionCard>
            </Box>
          )}

          {/* TAB 2: Asal Sekolah & LPTK */}
          {activeTab === 1 && (
            <Box>
              <SectionCard
                icon={<SchoolIcon fontSize="small" />}
                title="Informasi Asal Sekolah"
              >
                <Grid item xs={12}>
                  {renderInfoItem("Nama Sekolah", ppgDetail?.nama_sekolah)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("NPSN Sekolah", ppgDetail?.npsn_sekolah)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Jenjang Sekolah",
                    ppgDetail?.jenjang_sekolah,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Provinsi Sekolah",
                    ppgDetail?.provinsi_sekolah,
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Kota/Kab Sekolah",
                    ppgDetail?.kota_kab_sekolah,
                  )}
                </Grid>
              </SectionCard>

              <SectionCard
                icon={<BusinessCenterIcon fontSize="small" />}
                title="Penempatan LPTK"
              >
                <Grid item xs={12} sm={6}>
                  {renderInfoItem("Kode Bidang Studi", ppgDetail?.kode_bs_ppg)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderInfoItem(
                    "Bidang Studi PPG",
                    ppgDetail?.bidang_studi_ppg,
                  )}
                </Grid>
                <Grid item xs={12}>
                  {renderInfoItem("LPTK Penempatan", ppgDetail?.lptk)}
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

export default ModalDetailPpg;
