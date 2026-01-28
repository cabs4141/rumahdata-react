import { usePtkStore } from "../../../stores/usePtkStore";
import { useNotificationStore } from "../../../stores/useNotifStore";
import DataTable from "../DataTable";
import { Typography } from "@mui/material";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { useCallback } from "react";

const Ptk = () => {
  const { isFetching, ptkData, isLoading, totalPages, currentPage, currentLimit, deletePtk, uploadPtk, searchPtk, currentQuery } = usePtkStore(
    useShallow((state) => ({
      isFetching: state.isFetching,
      ptkData: state.ptkData,
      isLoading: state.isLoading,
      totalPages: state.totalPages,
      currentPage: state.currentPage,
      currentLimit: state.currentLimit,
      deletePtk: state.deletePtk,
      uploadPtk: state.uploadPtk,
      searchPtk: state.searchPtk,
      currentQuery: state.currentQuery,
    })),
  );
  const { showNotification } = useNotificationStore();
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
    ],
    [currentLimit, currentPage],
  );

  const handleUpload = useCallback(
    async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        await uploadPtk(formData);
        showNotification("Data berhasil diupload!", "success");
        await searchPtk("", 1, currentLimit);
      } catch (error) {
        showNotification(error.message || "Gagal mengunggah file", "error");
      }
    },
    [uploadPtk, showNotification, searchPtk, currentLimit],
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
        onFetch={searchPtk}
        onDelete={deletePtk}
        onUpload={handleUpload}
        initialSearch={currentQuery}
      />
    </div>
  );
};

export default Ptk;
