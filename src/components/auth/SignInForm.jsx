import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useUserStore } from "../../stores/useUserStore";
import { jwtDecode } from "jwt-decode";

const SignInForm = () => {
  const navigate = useNavigate();
  const { login, token, logout } = useUserStore();
  const [payload, setPayload] = useState({
    nip: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      login(payload);
      navigate("/");
      console.log("ter navigate ke /");
    } catch (error) {
      console.log("terjadi kesalahan:", error);
      alert(error.response.data.message);
      navigate("/signin");
    }
  };

  useEffect(() => {
    if (token) {
      try {
        jwtDecode(token);
        navigate("/");
      } catch (error) {
        console.log("Token invalid di halaman login, membersihkan...");
        logout();
      }
    }
  }, [token, navigate, logout]);

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Masuk</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Masukkan NIP dan kata sandi</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    NIP <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input type="text" name="nip" value={payload.nip} onChange={handleChange} required placeholder="NIP" />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Isi password" name="password" value={payload.password} onChange={handleChange} required />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Masuk
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Belum memiliki akun? {""}
                <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Daftar disini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
