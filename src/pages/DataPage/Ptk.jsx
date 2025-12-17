import React, { useEffect } from "react";

export default function Ptk() {
  // Gunakan useEffect untuk menjalankan efek samping (seperti alert)
  useEffect(() => {
    // alert("pukimak"); // Ini akan berjalan HANYA sekali setelah render pertama
    console.log("PTK component mounted"); // Lebih baik menggunakan console.log
  }, []); // Array kosong [] memastikan ini hanya berjalan saat komponen mount

  return (
    <>
      <div className="space-y-6">
        <h1 className="flex bg-amber-300 text-black w-full h-full ">Halaman Data PTK</h1>
      </div>
    </>
  );
}
