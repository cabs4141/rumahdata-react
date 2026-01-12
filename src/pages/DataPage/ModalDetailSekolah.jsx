import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Grid, Divider, Avatar, Stack, IconButton, Button, List, ListItem, ListItemAvatar, ListItemText, Paper, Chip } from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import MapIcon from "@mui/icons-material/Map";
import { useSekolahStore } from "../../stores/useSekolahStore";

const ModalDetailSekolah = ({ open, handleClose }) => {
  const { sekolahDetail } = useSekolahStore();

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: "6px" } }}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main", borderRadius: "6px", width: 50, height: 50 }}>
              <SchoolIcon />
            </Avatar>
            <Box>
              <Stack direction="row" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {sekolahDetail.sekolah_terpilih}
                </Typography>
              </Stack>
              {/* <Stack direction="row" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Email: {sekolahDetail.email}
                </Typography>
              </Stack> */}
              <Stack direction="row" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  NPSN: {sekolahDetail.npsn}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                {/* <MapIcon fontSize="small" color="action" /> */}
                <Typography variant="caption" color="text.secondary">
                  Alamat Jalan: {sekolahDetail.alamat}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: "primary.main", display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleIcon fontSize="small" /> DAFTAR PTK ({sekolahDetail.totalData})
        </Typography>

        <Paper variant="outlined" sx={{ borderRadius: "6px", overflow: "hidden" }}>
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
                        {/* Baris NIP */}
                        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "text.primary", fontWeight: 600 }}>
                          <BadgeIcon sx={{ fontSize: 14, color: "primary.main" }} />
                          <span style={{ color: "gray" }}>NIP:</span> {ptk.nip || "-"}
                        </Typography>

                        {/* Baris NIK */}
                        {/* <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.8, ml: 0.2 }}>
                          <Box sx={{ width: 14, display: "flex", justifyContent: "center" }}>
                            <Box sx={{ width: 4, height: 4, bgcolor: "text.disabled", borderRadius: "50%" }} />
                          </Box>
                          <span style={{ color: "gray" }}>NIK:</span> {ptk.nik || "-"}
                        </Typography> */}

                        {/* Baris Jenis PTK */}
                        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.8, ml: 0.2 }}>
                          <Box sx={{ width: 14, display: "flex", justifyContent: "center" }}>
                            <Box sx={{ width: 4, height: 4, bgcolor: "text.disabled", borderRadius: "50%" }} />
                          </Box>
                          <span style={{ color: "gray" }}>Jenis PTK:</span>
                          <Chip label={ptk.jenis_ptk} size="small" sx={{ height: 18, fontSize: "9px", fontWeight: 700, bgcolor: "primary.light", color: "white", ml: 0.5 }} />
                        </Typography>

                        {/* Baris Semester */}
                        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.8, ml: 0.2 }}>
                          <Box sx={{ width: 14, display: "flex", justifyContent: "center" }}>
                            <Box sx={{ width: 4, height: 4, bgcolor: "text.disabled", borderRadius: "50%" }} />
                          </Box>
                          <span style={{ color: "gray" }}>Semester:</span> {ptk.semester}
                        </Typography>
                      </Stack>
                    }
                  />
                  {/* <Chip label="Lihat Detail" size="small" variant="outlined" clickable sx={{ borderRadius: "6px", fontSize: "10px" }} /> */}
                </ListItem>
                {index < sekolahDetail.data_ptk.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} fullWidth variant="contained" sx={{ borderRadius: "3px", textTransform: "none", fontWeight: 700 }}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDetailSekolah;
