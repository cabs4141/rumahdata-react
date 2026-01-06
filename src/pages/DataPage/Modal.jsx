import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Modal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DeleteForeverIcon color="error" /> {"Konfirmasi Hapus Seluruh Data"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Apakah Anda yakin ingin menghapus <strong>seluruh data</strong>? Tindakan ini tidak dapat dibatalkan dan semua data yang ada di tabel ini akan hilang secara permanen.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Batal
        </Button>
        <Button
          onClick={() => {
            onConfirm(); // Jalankan fungsi hapus
            onClose(); // Tutup modal
          }}
          variant="contained"
          color="error"
          autoFocus
        >
          Ya, Hapus Semua
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
