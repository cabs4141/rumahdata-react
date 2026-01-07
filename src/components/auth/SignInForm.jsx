import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Typography, TextField, Button, IconButton, InputAdornment, Container, Snackbar, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUserStore } from "../../stores/useUserStore";
import { jwtDecode } from "jwt-decode";
import { useNotificationStore } from "../../stores/useNotifStore";

const SignInForm = () => {
  const navigate = useNavigate();
  const { login, token, logout } = useUserStore();
  const { showNotification } = useNotificationStore();

  const [payload, setPayload] = useState({
    nip: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
      await login(payload);
    } catch (error) {
      console.log("Submit error:", error);
      showNotification(error.response?.data?.message || "Login Gagal", "error");
    }
  };

  useEffect(() => {
    if (token) {
      try {
        jwtDecode(token);
        navigate("/");
      } catch (error) {
        console.log("Token invalid, cleaning up...");
        logout();
      }
    }
  }, [token, navigate, logout]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
            Masuk
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Masukkan NIP dan kata sandi Anda
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              placeholder="Isi password"
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
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Masuk
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Belum memiliki akun?{" "}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "500",
              }}
            >
              Daftar disini
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInForm;
