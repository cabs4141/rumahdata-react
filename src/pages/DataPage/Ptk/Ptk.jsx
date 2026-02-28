import { usePtkStore } from "../../../stores/usePtkStore";
import { useNotificationStore } from "../../../stores/useNotifStore";
import DataTable from "../DataTable";
import { Typography } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { useMemo, useEffect } from "react";
import { useCallback } from "react";

const Ptk = () => {
  const { isFetching, ptkData, isLoading, totalPages, currentPage, currentLimit, deletePtk, uploadPtk, getPtk, currentQuery, filters, setFilters, ptkStatistik, getStatistikPtk } = usePtkStore(
    useShallow((state) => ({
      isFetching: state.isFetching,
      ptkData: state.ptkData,
      isLoading: state.isLoading,
      totalPages: state.totalPages,
      currentPage: state.currentPage,
      currentLimit: state.currentLimit,
      deletePtk: state.deletePtk,
      uploadPtk: state.uploadPtk,
      getPtk: state.getPtk,
      currentQuery: state.currentQuery,
      filters: state.filters,
      setFilters: state.setFilters,
      ptkStatistik: state.ptkStatistik,
      getStatistikPtk: state.getStatistikPtk,
    })),
  );
  const { showNotification } = useNotificationStore();

  const kabupatenOptions = useMemo(() => {
    if (!ptkStatistik) return [];
    const unique = [...new Set(ptkStatistik.map((p) => p.kabupaten?.trim()).filter(Boolean))];
    return unique.sort();
  }, [ptkStatistik]);

  const handleFilterOpen = useCallback(() => {
    if (!ptkStatistik || ptkStatistik.length === 0) {
      getStatistikPtk();
    }
  }, [ptkStatistik, getStatistikPtk]);

  const columns = useMemo(
    () => [
      {
        header: "NO",
        accessor: "no",
        render: (row, index) => (
          // Gunakan variant body2 agar ukuran font pas dengan data tabel lainnya
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
            {(currentPage - 1) * currentLimit + index + 1}
          </Typography>
        ),
      },
      { header: "ID PTK", accessor: "ptk_id" },
      { header: "NAMA", accessor: "nama" },
      { header: "ID SEKOLAH", accessor: "sekolah_id" },
      { header: "NIP", accessor: "nip" },
      { header: "JENIS KELAMIN", accessor: "jenis_kelamin" },
      { header: "TEMPAT LAHIR", accessor: "tempat_lahir" },
      { header: "TANGGAL LAHIR", accessor: "tanggal_lahir" },
      { header: "NIK", accessor: "nik" },
      { header: "STATUS KEPEGAWAIAN", accessor: "status_kepegawaian" },
      { header: "KODE POS", accessor: "kode_pos" },
      { header: "EMAIL", accessor: "email" },
      { header: "STATUS KEAKTIFAN", accessor: "status_keaktifan" },
      { header: "NPWP", accessor: "npwp" },
      { header: "SEMESTER", accessor: "semester", hide: true },
      { header: "PTK TERDAFTAR ID", accessor: "ptk_terdaftar_id", hide: true },
      { header: "NO KK", accessor: "no_kk", hide: true },
      { header: "NIY/NIGK", accessor: "niy_nigk", hide: true },
      { header: "JENIS PTK", accessor: "jenis_ptk", hide: true },
      { header: "PENGAWAS BIDANG STUDI", accessor: "pengawas_bidang_studi", hide: true },
      { header: "AGAMA", accessor: "agama", hide: true },
      { header: "KEWARGANEGARAAN", accessor: "kewarganegaraan", hide: true },
      { header: "ALAMAT JALAN", accessor: "alamat_jalan", hide: true },
      { header: "RT", accessor: "rt", hide: true },
      { header: "RW", accessor: "rw", hide: true },
      { header: "NAMA DUSUN", accessor: "nama_dusun", hide: true },
      { header: "KODE DESA/KELURAHAN", accessor: "kode_desa_kelurahan", hide: true },
      { header: "DESA/KELURAHAN", accessor: "desa_kelurahan", hide: true },
      { header: "KODE KECAMATAN", accessor: "kode_kecamatan", hide: true },
      { header: "KECAMATAN", accessor: "kecamatan", hide: true },
      { header: "KODE KABUPATEN", accessor: "kode_kabupaten", hide: true },
      { header: "KABUPATEN", accessor: "kabupaten", hide: true },
      { header: "KODE PROVINSI", accessor: "kode_provinsi", hide: true },
      { header: "PROVINSI", accessor: "provinsi", hide: true },
      { header: "LINTANG", accessor: "lintang", hide: true },
      { header: "BUJUR", accessor: "bujur", hide: true },
      { header: "NO TELEPON RUMAH", accessor: "no_telepon_rumah", hide: true },
      { header: "SK CPNS", accessor: "sk_cpns", hide: true },
      { header: "TGL CPNS", accessor: "tgl_cpns", hide: true },
      { header: "SK PENGANGKATAN", accessor: "sk_pengangkatan", hide: true },
      { header: "TMT PENGANGKATAN", accessor: "tmt_pengangkatan", hide: true },
      { header: "LEMBAGA PENGANGKAT", accessor: "lembaga_pengangkat", hide: true },
      { header: "PANGKAT GOLONGAN", accessor: "pangkat_golongan", hide: true },
      { header: "KEAHLIAN LABORATORIUM", accessor: "keahlian_laboratorium", hide: true },
      { header: "SUMBER GAJI", accessor: "sumber_gaji", hide: true },
      { header: "NAMA IBU KANDUNG", accessor: "nama_ibu_kandung", hide: true },
      { header: "STATUS PERKAWINAN", accessor: "status_perkawinan", hide: true },
      { header: "NAMA SUAMI/ISTRI", accessor: "nama_suami_istri", hide: true },
      { header: "NIP SUAMI/ISTRI", accessor: "nip_suami_istri", hide: true },
      { header: "TMT PNS", accessor: "tmt_pns", hide: true },
      { header: "SUDAH LISENSI KEPALA SEKOLAH", accessor: "sudah_lisensi_kepala_sekolah", hide: true },
      { header: "JUMLAH SEKOLAH BINAAN", accessor: "jumlah_sekolah_binaan", hide: true },
      { header: "PERNAH DIKLAT KEPENGAWASAN", accessor: "pernah_diklat_kepengawasan", hide: true },
      { header: "NM WP", accessor: "nm_wp", hide: true },
      { header: "STATUS DATA", accessor: "status_data", hide: true },
      { header: "KARPEG", accessor: "karpeg", hide: true },
      { header: "KARPAS", accessor: "karpas", hide: true },
      { header: "MAMPU HANDLE KK", accessor: "mampu_handle_kk", hide: true },
      { header: "KEAHLIAN BRAILLE", accessor: "keahlian_braille", hide: true },
      { header: "KEAHLIAN BHS ISYARAT", accessor: "keahlian_bhs_isyarat", hide: true },
      { header: "REKENING BANK", accessor: "rekening_bank", hide: true },
      { header: "REKENING ATAS NAMA", accessor: "rekening_atas_nama", hide: true },
      { header: "TAHUN AJARAN", accessor: "tahun_ajaran", hide: true },
      { header: "NOMOR SURAT TUGAS", accessor: "nomor_surat_tugas", hide: true },
      { header: "TANGGAL SURAT TUGAS", accessor: "tanggal_surat_tugas", hide: true },
      { header: "TMT TUGAS", accessor: "tmt_tugas", hide: true },
      { header: "PTK INDUK", accessor: "ptk_induk", hide: true },
      { header: "JENIS KELUAR", accessor: "jenis_keluar", hide: true },
      { header: "TGL PTK KELUAR", accessor: "tgl_ptk_keluar", hide: true },
      { header: "RIWAYAT KEPANGKATAN PANGKAT GOLONGAN", accessor: "riwayat_kepangkatan_pangkat_golongan", hide: true },
      { header: "RIWAYAT KEPANGKATAN NOMOR SK", accessor: "riwayat_kepangkatan_nomor_sk", hide: true },
      { header: "RIWAYAT KEPANGKATAN TANGGAL SK", accessor: "riwayat_kepangkatan_tanggal_sk", hide: true },
      { header: "RIWAYAT KEPANGKATAN TMT PANGKAT", accessor: "riwayat_kepangkatan_tmt_pangkat", hide: true },
      { header: "RIWAYAT KEPANGKATAN MASA KERJA GOL TAHUN", accessor: "riwayat_kepangkatan_masa_kerja_gol_tahun", hide: true },
      { header: "RIWAYAT KEPANGKATAN MASA KERJA GOL BULAN", accessor: "riwayat_kepangkatan_masa_kerja_gol_bulan", hide: true },
      { header: "RIWAYAT GAJI BERKALA PANGKAT GOLONGAN", accessor: "riwayat_gaji_berkala_pangkat_golongan", hide: true },
      { header: "RIWAYAT GAJI BERKALA NOMOR SK", accessor: "riwayat_gaji_berkala_nomor_sk", hide: true },
      { header: "RIWAYAT GAJI BERKALA TANGGAL SK", accessor: "riwayat_gaji_berkala_tanggal_sk", hide: true },
      { header: "RIWAYAT GAJI BERKALA TMT KGB", accessor: "riwayat_gaji_berkala_tmt_kgb", hide: true },
      { header: "RIWAYAT GAJI BERKALA MASA KERJA TAHUN", accessor: "riwayat_gaji_berkala_masa_kerja_tahun", hide: true },
      { header: "RIWAYAT GAJI BERKALA MASA KERJA BULAN", accessor: "riwayat_gaji_berkala_masa_kerja_bulan", hide: true },
      { header: "RIWAYAT GAJI BERKALA GAJI POKOK", accessor: "riwayat_gaji_berkala_gaji_pokok", hide: true },
      { header: "INPASSING PANGKAT GOLONGAN", accessor: "inpassing_pangkat_golongan", hide: true },
      { header: "INPASSING NO SK INPASSING", accessor: "inpassing_no_sk_inpassing", hide: true },
      { header: "INPASSING TGL SK INPASSING", accessor: "inpassing_tgl_sk_inpassing", hide: true },
      { header: "INPASSING TMT INPASSING", accessor: "inpassing_tmt_inpassing", hide: true },
      { header: "INPASSING ANGKA KREDIT", accessor: "inpassing_angka_kredit", hide: true },
      { header: "INPASSING MASA KERJA TAHUN", accessor: "inpassing_masa_kerja_tahun", hide: true },
      { header: "INPASSING MASA KERJA BULAN", accessor: "inpassing_masa_kerja_bulan", hide: true },
      { header: "RIWAYAT SERTIFIKASI BIDANG STUDI", accessor: "riwayat_sertifikasi_bidang_studi", hide: true },
      { header: "RIWAYAT SERTIFIKASI JENIS SERTIFIKASI", accessor: "riwayat_sertifikasi_jenis_sertifikasi", hide: true },
      { header: "RIWAYAT SERTIFIKASI TAHUN SERTIFIKASI", accessor: "riwayat_sertifikasi_tahun_sertifikasi", hide: true },
      { header: "RIWAYAT SERTIFIKASI NOMOR SERTIFIKAT", accessor: "riwayat_sertifikasi_nomor_sertifikat", hide: true },
      { header: "RIWAYAT SERTIFIKASI NRG", accessor: "riwayat_sertifikasi_nrg", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL BIDANG STUDI", accessor: "riwayat_pendidikan_formal_bidang_studi", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL JENJANG PENDIDIKAN", accessor: "riwayat_pendidikan_formal_jenjang_pendidikan", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL GELAR AKADEMIK", accessor: "riwayat_pendidikan_formal_gelar_akademik", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL SATUAN PENDIDIKAN FORMAL", accessor: "riwayat_pendidikan_formal_satuan_pendidikan_formal", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL FAKULTAS", accessor: "riwayat_pendidikan_formal_fakultas", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL KEPENDIDIKAN", accessor: "riwayat_pendidikan_formal_kependidikan", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL TAHUN MASUK", accessor: "riwayat_pendidikan_formal_tahun_masuk", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL TAHUN LULUS", accessor: "riwayat_pendidikan_formal_tahun_lulus", hide: true },
      { header: "RIWAYAT PENDIDIKAN FORMAL NIM", accessor: "riwayat_pendidikan_formal_nim", hide: true },
      { header: "JUMLAH ANAK", accessor: "jumlah_anak", hide: true },
      { header: "TUGAS TAMBAHAN JABATAN PTK", accessor: "tugas_tambahan_jabatan_ptk", hide: true },
      { header: "TUGAS TAMBAHAN SEKOLAH", accessor: "tugas_tambahan_sekolah", hide: true },
      { header: "TUGAS TAMBAHAN JUMLAH JAM", accessor: "tugas_tambahan_jumlah_jam", hide: true },
      { header: "TUGAS TAMBAHAN NOMOR SK", accessor: "tugas_tambahan_nomor_sk", hide: true },
      { header: "TUGAS TAMBAHAN TMT TAMBAHAN", accessor: "tugas_tambahan_tmt_tambahan", hide: true },
      { header: "TUGAS TAMBAHAN TST TAMBAHAN", accessor: "tugas_tambahan_tst_tambahan", hide: true },
      { header: "RIWAYAT STRUKTURAL JABATAN PTK", accessor: "riwayat_struktural_jabatan_ptk", hide: true },
      { header: "RIWAYAT STRUKTURAL SK STRUKTURAL", accessor: "riwayat_struktural_sk_struktural", hide: true },
      { header: "RIWAYAT STRUKTURAL TMT JABATAN", accessor: "riwayat_struktural_tmt_jabatan", hide: true },
      { header: "RIWAYAT FUNGSIONAL JABATAN FUNGSIONAL", accessor: "riwayat_fungsional_jabatan_fungsional", hide: true },
      { header: "RIWAYAT FUNGSIONAL SK JABFUNG", accessor: "riwayat_fungsional_sk_jabfung", hide: true },
      { header: "RIWAYAT FUNGSIONAL TMT JABATAN", accessor: "riwayat_fungsional_tmt_jabatan", hide: true },
      { header: "JABATAN PTK", accessor: "jabatan_ptk", hide: true },
    ],
    [currentLimit, currentPage],
  );

  // Adapter function to match DataTable's expectations (query, page, limit)
  const handleFetch = useCallback(
    (query, page, limit) => {
      getPtk({ query, page, limit });
    },
    [getPtk]
  );

  const handleUpload = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        await uploadPtk(formData);
        showNotification("Data berhasil diupload!", "success");
        // No need to call searchPtk here, uploadPtk handles refresh in store
      } catch (error) {
        showNotification(error.message || "Gagal mengunggah file", "error");
      }
    },
    [uploadPtk, showNotification],
  );

  return (
    <div className="w-full max-w-full flex flex-col h-[calc(100vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
      <DataTable
        isFetching={isFetching}
        columns={columns}
        dataTitle={"Data PTK"}
        data={ptkData}
        totalPages={totalPages}
        isLoading={isLoading}
        currentLimit={currentLimit}
        currentPage={currentPage}
        onFetch={handleFetch}
        onDelete={deletePtk}
        onUpload={handleUpload}
        initialSearch={currentQuery}
        filterOptions={kabupatenOptions}
        currentFilters={filters}
        onFilterChange={setFilters}
        onFilterOpen={handleFilterOpen}
      />
    </div>
  );
};

export default Ptk;
