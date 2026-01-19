// Sekolah.jsx
import { useMemo, useCallback } from "react"; // Import useMemo & useCallback
import DataTable from "../DataTable.jsx";
import { useSekolahStore } from "../../../stores/useSekolahStore.js";
import { useNotificationStore } from "../../../stores/useNotifStore";
import { Typography } from "@mui/material";
import { useShallow } from "zustand/react/shallow"; // WAJIB: Import useShallow

const Sekolah = () => {
  // 1. OPTIMASI ZUSTAND: Gunakan useShallow agar tidak re-render berlebihan
  const { sekolahData, isLoading, totalPages, currentPage, currentLimit, deleteSekolah, uploadSekolah, searchSekolah, isFetching, currentQuery } = useSekolahStore(
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
    }))
  );

  const { showNotification } = useNotificationStore();

  // 2. OPTIMASI COLUMNS: Gunakan useMemo
  // Columns hanya dibuat ulang jika currentPage atau currentLimit berubah
  const columns = useMemo(
    () => [
      {
        header: "NO",
        accessor: "no",
        render: (row, index) => (
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
            {(currentPage - 1) * currentLimit + index + 1}
          </Typography>
        ),
      },
      { header: "ID SEKOLAH", accessor: "sekolah_id" },
      { header: "NAMA SEKOLAH", accessor: "nama" },
      { header: "ID NPSN", accessor: "npsn" },
      { header: "BENTUK PENDIDIKAN", accessor: "bentuk_pendidikan" },
      { header: "JENJANG", accessor: "jenjang" },
      { header: "ALMAT JALAN", accessor: "alamat_jalan" },
      { header: "DESA KELURAHAN", accessor: "desa_kelurahan" },
      { header: "KECAMATAN", accessor: "kecamatan" },
      { header: "KABUPATEN", accessor: "kabupaten" },
      { header: "PROVINSI", accessor: "provinsi" },
    ],
    [currentPage, currentLimit]
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
    [uploadSekolah, showNotification, searchSekolah, currentLimit]
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
      />
    </div>
  );
};

export default Sekolah;
