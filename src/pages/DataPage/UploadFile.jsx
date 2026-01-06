import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const UploadFile = ({ setOpen, open, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setFile(null); // Reset file saat modal tutup
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) return;

    // Kirim file ke fungsi onUpload (yang akan memanggil store)
    onUpload(file);
    handleClose();
  };

  return (
    <React.Fragment>
      {/* Tombol Pemicu */}
      <Button startIcon={<CloudUploadIcon fontSize="small" />} variant="contained" color="primary" size="small" onClick={() => setOpen(true)}>
        Upload File
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Import Data Excel</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Pilih file Excel (.xlsx atau .csv) untuk mengimpor data ke sistem.</DialogContentText>

          <form onSubmit={handleSubmit} id="upload-form">
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 4, // Padding diperbesar agar area lebih luas
                textAlign: "center",
                bgcolor: "#fafafa",
                cursor: "pointer",
                display: "flex", // Tambahkan flex
                flexDirection: "column", // Arah vertikal
                alignItems: "center", // Rata tengah horizontal
                justifyContent: "center", // Rata tengah vertikal
                width: "100%", // Mengikuti lebar Dialog
                minHeight: "150px", // Beri tinggi minimal agar tidak gepeng
                transition: "all 0.3s",
                "&:hover": {
                  bgcolor: "#f0f7ff",
                  borderColor: "primary.main",
                },
              }}
              component="label"
            >
              <input type="file" hidden accept=".xlsx, .xls, .csv" onChange={handleFileChange} />

              {/* Icon sekarang proporsional */}
              <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />

              <Typography variant="body1" sx={{ fontWeight: "500", color: "text.primary" }}>
                {file ? file.name : "Klik atau Tarik File ke Sini"}
              </Typography>

              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                {file ? `Ukuran: ${(file.size / 1024).toFixed(2)} KB` : "Format yang didukung: Excel atau CSV"}
              </Typography>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Batal
          </Button>
          <Button type="submit" form="upload-form" variant="contained" disabled={!file}>
            Upload Sekarang
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UploadFile;
