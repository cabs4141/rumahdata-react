// Sekolah.jsx
import { useMemo, useCallback, useEffect } from "react"; // Import useMemo & useCallback
import DataTable from "@/pages/DataPage/DataTable.jsx";
import { useSekolahStore } from "@/features/sekolah/stores/useSekolahStore.js";
import { useNotificationStore } from "@/stores/useNotifStore";
import { Typography } from "@mui/material";
import { useShallow } from "zustand/react/shallow"; // WAJIB: Import useShallow

const Sekolah = () => {
  // 1. OPTIMASI ZUSTAND: Gunakan useShallow agar tidak re-render berlebihan
  const {
    sekolahData,
    isLoading,
    totalPages,
    currentPage,
    currentLimit,
    deleteSekolah,
    uploadSekolah,
    searchSekolah,
    isFetching,
    currentQuery,
    filters,
    setFilters,
    sekolahStatistik,
    getStatistikSekolah,
  } = useSekolahStore(
    useShallow((state) => ({
      sekolahData: state.sekolahData,
      isLoading: state.isLoading,
      totalPages: state.totalPages,
      currentPage: state.currentPage,
      currentLimit: state.currentLimit,
      deleteSekolah: state.deleteSekolah,
      uploadSekolah: state.uploadSekolah,
      searchSekolah: state.searchSekolah,
      isFetching: state.isFetching,
      currentQuery: state.currentQuery,
      filters: state.filters,
      setFilters: state.setFilters,
      sekolahStatistik: state.sekolahStatistik,
      getStatistikSekolah: state.getStatistikSekolah,
    })),
  );

  const kabupatenOptions = useMemo(() => {
    if (!sekolahStatistik) return [];
    const unique = [
      ...new Set(
        sekolahStatistik.map((s) => s.kabupaten?.trim()).filter(Boolean),
      ),
    ];
    return unique.sort();
  }, [sekolahStatistik]);

  const { showNotification } = useNotificationStore();

  const handleFilterOpen = useCallback(() => {
    if (!sekolahStatistik || sekolahStatistik.length === 0) {
      getStatistikSekolah();
    }
  }, [sekolahStatistik, getStatistikSekolah]);

  // 2. OPTIMASI COLUMNS: Gunakan useMemo
  // Columns hanya dibuat ulang jika currentPage atau currentLimit berubah
  const columns = useMemo(
    () => [
      {
        header: "NO",
        accessor: "no",
        render: (row, index) => (
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            {(currentPage - 1) * currentLimit + index + 1}
          </Typography>
        ),
      },
      { header: "ID SEKOLAH", accessor: "sekolah_id" },
      { header: "NAMA SEKOLAH", accessor: "nama" },
      { header: "ID NPSN", accessor: "npsn" },
      { header: "BENTUK PENDIDIKAN", accessor: "bentuk_pendidikan" },
      { header: "JENJANG", accessor: "jenjang" },
      { header: "ALAMAT JALAN", accessor: "alamat_jalan" },
      { header: "DESA KELURAHAN", accessor: "desa_kelurahan" },
      { header: "KECAMATAN", accessor: "kecamatan" },
      { header: "KABUPATEN", accessor: "kabupaten" },
      { header: "PROVINSI", accessor: "provinsi" },
      {
        header: "KODE DESA/KELURAHAN",
        accessor: "kode_desa_kelurahan",
        hide: true,
      },
      { header: "KODE KECAMATAN", accessor: "kode_kecamatan", hide: true },
      { header: "KODE KABUPATEN", accessor: "kode_kabupaten", hide: true },
      { header: "KODE PROVINSI", accessor: "kode_provinsi", hide: true },
      { header: "KODE POS", accessor: "kode_pos", hide: true },
      { header: "EMAIL", accessor: "email", hide: true },
      { header: "KEBUTUHAN KHUSUS", accessor: "kebutuhan_khusus", hide: true },
      { header: "STATUS SEKOLAH", accessor: "status_sekolah", hide: true },
      { header: "SK PENDIRIAN", accessor: "sk_pendirian_sekolah", hide: true },
      {
        header: "TANGGAL SK PENDIRIAN",
        accessor: "tanggal_sk_pendirian",
        hide: true,
      },
      {
        header: "STATUS KEPEMILIKAN",
        accessor: "status_kepemilikan",
        hide: true,
      },
      { header: "YAYASAN", accessor: "yayasan", hide: true },
      {
        header: "SK IZIN OPERASIONAL",
        accessor: "sk_izin_operasional",
        hide: true,
      },
      {
        header: "TGL SK IZIN OPERASIONAL",
        accessor: "tanggal_sk_izin_operasional",
        hide: true,
      },
      {
        header: "REKENING ATAS NAMA",
        accessor: "rekening_atas_nama",
        hide: true,
      },
      { header: "MBS", accessor: "mbs", hide: true },
      { header: "KODE REGISTRASI", accessor: "kode_registrasi", hide: true },
      { header: "NPWP", accessor: "npwp", hide: true },
      { header: "NM WP", accessor: "nm_wp", hide: true },
      { header: "KEAKTIFAN", accessor: "keaktifan", hide: true },
      {
        header: "WILAYAH TERPENCIL",
        accessor: "wilayah_terpencil",
        hide: true,
      },
      {
        header: "WILAYAH PERBATASAN",
        accessor: "wilayah_perbatasan",
        hide: true,
      },
      {
        header: "WILAYAH TRANSMIGRASI",
        accessor: "wilayah_transmigrasi",
        hide: true,
      },
      {
        header: "WILAYAH ADAT TERPENCIL",
        accessor: "wilayah_adat_terpencil",
        hide: true,
      },
      {
        header: "WILAYAH BENCANA ALAM",
        accessor: "wilayah_bencana_alam",
        hide: true,
      },
      {
        header: "WILAYAH BENCANA SOSIAL",
        accessor: "wilayah_bencana_sosial",
        hide: true,
      },
      { header: "PARTISIPASI BOS", accessor: "partisipasi_bos", hide: true },
      { header: "AKSES INTERNET", accessor: "akses_internet", hide: true },
      { header: "AKSES INTERNET 2", accessor: "akses_internet_2", hide: true },
      { header: "AKREDITASI", accessor: "akreditasi", hide: true },
      {
        header: "AKREDITASI SP TMT",
        accessor: "akreditasi_sp_tmt",
        hide: true,
      },
      { header: "AKREDITASI SP SK", accessor: "akreditasi_sp_sk", hide: true },
      { header: "LUAS TANAH MILIK", accessor: "luas_tanah_milik", hide: true },
      {
        header: "LUAS TANAH BUKAN MILIK",
        accessor: "luas_tanah_bukan_milik",
        hide: true,
      },
      { header: "ANGKATAN PSP", accessor: "angkatan_psp", hide: true },
      { header: "NAMA NOMENKLATUR", accessor: "nama_nomenklatur", hide: true },
      { header: "NSS", accessor: "nss", hide: true },
      { header: "RT", accessor: "rt", hide: true },
      { header: "RW", accessor: "rw", hide: true },
      { header: "NAMA DUSUN", accessor: "nama_dusun", hide: true },
      { header: "LINTANG", accessor: "lintang", hide: true },
      { header: "BUJUR", accessor: "bujur", hide: true },
      { header: "NOMOR TELEPON", accessor: "nomor_telepon", hide: true },
      { header: "NOMOR FAX", accessor: "nomor_fax", hide: true },
      { header: "WEBSITE", accessor: "website", hide: true },
      { header: "NO REKENING", accessor: "no_rekening", hide: true },
      { header: "NAMA BANK", accessor: "nama_bank", hide: true },
      { header: "CABANG KCP UNIT", accessor: "cabang_kcp_unit", hide: true },
      { header: "DAYA LISTRIK", accessor: "daya_listrik", hide: true },
      {
        header: "KONTINUITAS LISTRIK",
        accessor: "kontinuitas_listrik",
        hide: true,
      },
      { header: "JARAK LISTRIK", accessor: "jarak_listrik", hide: true },
      {
        header: "WAKTU PENYELENGGARAAN",
        accessor: "waktu_penyelenggaraan",
        hide: true,
      },
      { header: "SUMBER LISTRIK", accessor: "sumber_listrik", hide: true },
      { header: "SERTIFIKASI ISO", accessor: "sertifikasi_iso", hide: true },
      {
        header: "INTERNET JENIS LAYANAN",
        accessor: "internet_jenis_layanan",
        hide: true,
      },
      {
        header: "INTERNET JENIS KONEKSI",
        accessor: "internet_jenis_koneksi",
        hide: true,
      },
      {
        header: "INTERNET PROVIDER",
        accessor: "internet_provider",
        hide: true,
      },
      {
        header: "INTERNET BANDWIDTH",
        accessor: "internet_bandwidth",
        hide: true,
      },
      {
        header: "INTERNET BANDWIDTH UP",
        accessor: "internet_bandwidth_up",
        hide: true,
      },
      {
        header: "INTERNET BANDWIDTH DOWN",
        accessor: "internet_bandwidth_down",
        hide: true,
      },
      { header: "INTERNET LATENCY", accessor: "internet_latency", hide: true },
      { header: "LISTRIK SUMBER", accessor: "listrik_sumber", hide: true },
      { header: "LISTRIK DAYA", accessor: "listrik_daya", hide: true },
      {
        header: "LISTRIK KONTINUITAS",
        accessor: "listrik_kontinuitas",
        hide: true,
      },
      {
        header: "LISTRIK ID PELANGGAN",
        accessor: "listrik_id_pelanggan",
        hide: true,
      },
      {
        header: "LISTRIK NOMOR METER",
        accessor: "listrik_nomor_meter",
        hide: true,
      },
      {
        header: "LISTRIK JENIS METER",
        accessor: "listrik_jenis_meter",
        hide: true,
      },
      {
        header: "LISTRIK STATUS SAMBUNGAN",
        accessor: "listrik_status_sambungan",
        hide: true,
      },
      { header: "LISTRIK UTAMA", accessor: "listrik_utama", hide: true },
    ],
    [currentPage, currentLimit],
  ); // Dependencies

  // 3. OPTIMASI FUNCTION: Gunakan useCallback agar referensi fungsi stabil
  const handleUpload = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const success = await uploadSekolah(formData);

        if (success) {
          showNotification("Data berhasil diupload!", "success");
          await searchSekolah("", 1, currentLimit);
        }
      } catch (error) {
        showNotification(error.message || "Gagal mengunggah file", "error");
      }
    },
    [uploadSekolah, showNotification, searchSekolah, currentLimit],
  );

  return (
    <div className="w-full max-w-full flex flex-col h-[calc(100vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
      <DataTable
        columns={columns}
        dataTitle={"Data Sekolah"}
        currentLimit={currentLimit}
        currentPage={currentPage}
        data={sekolahData}
        isLoading={isLoading}
        onFetch={searchSekolah}
        totalPages={totalPages}
        onDelete={deleteSekolah}
        onUpload={handleUpload}
        isFetching={isFetching}
        initialSearch={currentQuery}
        filterOptions={kabupatenOptions}
        currentFilters={filters}
        onFilterChange={setFilters}
        onFilterOpen={handleFilterOpen}
      />
    </div>
  );
};

export default Sekolah;
