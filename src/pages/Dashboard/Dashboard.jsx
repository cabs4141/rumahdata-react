import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../../stores/useUserStore";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useUserStore();

  // State untuk mencegah konten muncul sebelum token divalidasi
  useEffect(() => {
    console.log("render komponen dashboard dari use effect");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }

    try {
      // 1. Decode
      const decoded = jwtDecode(token);

      // 2. Cek Expired (Frontend cuma bisa cek ini)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      // 3. (PENTING) Cek kelengkapan data
      // Kadang token rusak isinya jadi null atau kosong
      if (!decoded.sub && !decoded.id && !decoded.nip) {
        throw new Error("Token format valid tapi isinya kosong/rusak");
      }
    } catch (error) {
      console.log("Tertangkap error:", error.message); // Cek console ini
      logout();
      navigate("/signin");
    }
  }, []);

  // Konten hanya muncul jika isAuthorized === true
  return (
    <div className="mt-24 flex gap-4 md:gap-6 items-center justify-center">
      <h1 className="text-2xl font-bold">Selamat Datang di Dashboard</h1>
      <p>Data rahasia user...</p>
    </div>
  );
};

export default Dashboard;
