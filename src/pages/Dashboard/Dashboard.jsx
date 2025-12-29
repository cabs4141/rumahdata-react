import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../../stores/useUserStore";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useUserStore();

  useEffect(() => {
    // Jika token tidak ada, kosong, atau string "undefined", langsung tendang keluar
    if (!token || token === "" || token === "undefined" || token === "null") {
      navigate("/signin", { replace: true });
      return; // PENTING: return agar code di bawah tidak dijalankan
    }

    // DECODE (Setelah dipastikan token ada)
    try {
      const decoded = jwtDecode(token);
      const statusUser = decoded.status;
      console.log("status user:", statusUser);

      // Opsional: Jika token rusak/invalid format, catch akan menangkapnya
    } catch (error) {
      console.error("Token rusak:", error);
      navigate("/signin", { replace: true });
    }
  }, [token, navigate]);

  return (
    <>
      <div className="flex gap-4 md:gap-6 items-center justify-center">selamat datang di dashboard</div>
    </>
  );
};

export default Dashboard;
