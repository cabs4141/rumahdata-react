import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useUserStore } from "../../stores/useUserStore";
import Button from "../ui/button/Button";
// import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  // const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, token } = useUserStore();
  const [payload, setPayload] = useState({
    nip: "",
    nama: "",
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
      const isSuccess = await register(payload);
      if (isSuccess) {
        navigate("/signin");
      }
    } catch (error) {
      console.log("terjadi kesalahan register komponen", error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Daftar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Masukkan NIP dan Password untuk daftar</p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* <!-- Name --> */}
                <div>
                  <Label>
                    Nama Lengkap<span className="text-error-500">*</span>
                  </Label>
                  <Input type="text" id="nama" name="nama" placeholder="Masukkan Nama Lengkap" onChange={handleChange} />
                </div>
                {/* <!-- NIP --> */}
                <div>
                  <Label>
                    NIP<span className="text-error-500">*</span>
                  </Label>
                  <Input type="text" id="nip" name="nip" placeholder="Masukkan NIP" onChange={handleChange} />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input placeholder="Masukkan Password" type={showPassword ? "text" : "password"} onChange={handleChange} name="password" />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                {/* <div className="flex items-center gap-3">
                  <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span> and our <span className="text-gray-800 dark:text-white">Privacy Policy</span>
                  </p>
                </div> */}
                {/* <!-- Button --> */}
                <div>
                  <Button className="w-full" size="sm">
                    Daftar
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Sudah memiliki akun? {""}
                <Link to="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Masuk disini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
