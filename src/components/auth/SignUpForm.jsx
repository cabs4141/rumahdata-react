import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Typography, TextField, Button, IconButton, InputAdornment, Container, Snackbar, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUserStore } from "../../stores/useUserStore";
import { useNotificationStore } from "../../stores/useNotifStore";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { register, token } = useUserStore();
  const { showNotification } = useNotificationStore();
  const [showPassword, setShowPassword] = useState(false);
  const [payload, setPayload] = useState({
    nip: "",
    nama: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isSuccess = await register(payload);
      if (isSuccess) {
        showNotification("Registrasi Berhasil", "success");
        navigate("/signin");
      }
    } catch (error) {
      showNotification(error.response?.data?.error || "Terjadi Kesalahan", "error");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
            Daftar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Masukkan Nama, NIP, dan Password untuk membuat akun baru
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField label="Nama Lengkap" name="nama" variant="outlined" fullWidth required value={payload.nama} onChange={handleChange} placeholder="Masukkan Nama Lengkap" />
            <TextField label="NIP" name="nip" variant="outlined" fullWidth required value={payload.nip} onChange={handleChange} placeholder="Masukkan NIP" />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              value={payload.password}
              onChange={handleChange}
              placeholder="Masukkan Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                textTransform: "none",
                py: 1.5,
                fontWeight: "bold",
              }}
            >
              Daftar
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Sudah memiliki akun?{" "}
            <Link to="/signin" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "500" }}>
              Masuk disini
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
