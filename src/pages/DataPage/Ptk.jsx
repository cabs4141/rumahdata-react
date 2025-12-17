// src/components/Ptk.jsx
import React, { useEffect } from "react";
import { usePtkStore } from "../../stores/usePtkStore";

const Ptk = () => {
  // Ambil state dan action yang dibutuhkan dari store
  const ptkData = usePtkStore((state) => state.ptkData);
  const isLoading = usePtkStore((state) => state.isLoading);
  const error = usePtkStore((state) => state.error);
  const fetchPtk = usePtkStore((state) => state.fetchPtk);

  // Efek untuk fetching data saat komponen dimuat
  useEffect(() => {
    // Hanya fetch jika data belum ada
    if (ptkData.length === 0) {
      fetchPtk();
    }
  }, [fetchPtk, ptkData.length]);

  // Efek kedua untuk debugging (opsional)
  useEffect(() => {
    if (ptkData.length > 0) {
      console.log("Data PTK berhasil dimuat:", ptkData);
    }
  }, [ptkData]);

  // --- RENDERING STATUS ---

  if (isLoading) {
    return <div>Memuat data PTK...</div>;
  }

  if (error) {
    return <div>Terjadi Kesalahan saat memuat data: {error}</div>;
  }

  if (ptkData.length === 0) {
    return <div>Tidak ada data PTK yang ditemukan.</div>;
  }

  // --- RENDERING TABEL ---

  // Asumsi: Data PTK memiliki kolom 'id', 'nama', dan 'nip'. Sesuaikan jika berbeda.
  return (
    <div className="space-y-3">
      <h1 className="bg-amber-300 text-black p-3">Halaman Data PTK ({ptkData.length} Data)</h1>

      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
        {/* Kepala Tabel (Header) */}
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">ID PTK</th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">NAMA</th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
          </tr>
        </thead>

        {/* Badan Tabel (Data) */}
        <tbody className="bg-white divide-y divide-gray-200">
          {ptkData.map((ptk, index) => (
            <tr key={ptk.id || index} className="hover:bg-gray-50">
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900 border-r">{ptk.ptk_id}</td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{ptk.nama}</td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{ptk.nip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ptk;
