import DataTable from "../DataTable.jsx";
import { useSekolahStore } from "../../../stores/useSekolahStore.js";
import { useNotificationStore } from "../../../stores/useNotifStore";

const Sekolah = () => {
  const { fetchSekolah, sekolahData, isLoading, totalPages, currentPage, currentLimit, deleteSekolah, uploadSekolah, searchSekolah } = useSekolahStore();
  const { showNotification } = useNotificationStore();
  const columns = [
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
  ];

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // "file" harus sesuai dengan nama field di backend
      const success = await uploadSekolah(formData);

      if (success) {
        showNotification("Data berhasil diupload!", "success");
        await searchSekolah("", 1, currentLimit);
      }
    } catch (error) {
      showNotification(error.message || "Gagal mengunggah file", "error");
    }
  };
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
      />
    </div>
  );
};

export default Sekolah;
