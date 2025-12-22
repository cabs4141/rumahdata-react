// src/components/Ptk.jsx
import React, { useEffect } from "react";
import { usePtkStore } from "../../stores/usePtkStore";

const Ptk = () => {
  const ptkData = usePtkStore((state) => state.ptkData);
  const isLoading = usePtkStore((state) => state.isLoading);
  const error = usePtkStore((state) => state.error);
  const fetchPtk = usePtkStore((state) => state.fetchPtk);

  useEffect(() => {
    if (ptkData.length === 0) {
      fetchPtk();
    }
  }, [fetchPtk, ptkData.length]);

  try {
    if (isLoading) {
      return <div>Memuat data PTK...</div>;
    } else if (ptkData.length === 0) {
      return <div>Data tidak ditemukan</div>;
    }
  } catch (e) {
    console.log(e.message);
  }

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <h1 className="flex bg-amber-300 text-black p-3 w-full">Halaman Data PTK ({ptkData.length} Data)</h1>

      <table className="min-w-full divide-y divide-gray-200">
        {/* Kepala Tabel */}
        <thead className="bg-gray-100">
          <tr>
            <th className="sticky left-0 bg-gray-100 px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-r">ID PTK</th>
            <th className="sticky left-[80px] bg-gray-100 px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-r">NAMA</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">NIP</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">JK</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">TEMPAT, TGL LAHIR</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">STATUS PEGAWAI</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">JENIS PTK</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">ALAMAT</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">PENDIDIKAN TERAKHIR</th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
          </tr>
        </thead>

        {/* Badan Tabel */}
        <tbody className="bg-white divide-y divide-gray-200">
          {ptkData.map((ptk, index) => (
            <tr key={ptk.ptk_id || index} className="hover:bg-gray-50 transition-colors">
              {/* Kolom ID (Sticky) */}
              <td className="sticky left-0 bg-white px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">{ptk.ptk_id}</td>

              {/* Kolom Nama (Sticky agar mudah dibaca saat scroll ke kanan) */}
              <td className="sticky left-[80px] bg-white px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold border-r">{ptk.nama}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{ptk.nip || "-"}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{ptk.jenis_kelamin}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                {ptk.tempat_lahir}, {ptk.tanggal_lahir}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 border-r">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{ptk.status_kepegawaian}</span>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{ptk.jenis_ptk}</td>
              <td className="px-3 py-4 text-sm text-gray-500 border-r max-w-xs truncate">{`${ptk.alamat_jalan}, RT ${ptk.rt}/RW ${ptk.rw}, ${ptk.desa_kelurahan}, ${ptk.kecamatan}`}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 border-r">{ptk.riwayat_pendidikan_formal_satuan_pendidikan_formal || "-"}</td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{ptk.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ptk;
