import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const ModalConfirm = ({ open, onClose, onConfirm, title, titleHead }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DeleteForeverIcon color="error" /> {titleHead}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{title}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Batal
        </Button>
        <Button
          onClick={() => {
            onConfirm(); // Jalankan fungsi hapus
            onClose(); // Tutup ModalConfirm
          }}
          variant="contained"
          color="error"
          autoFocus
        >
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirm;
