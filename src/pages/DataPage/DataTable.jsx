import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotificationStore } from "../../stores/useNotifStore";
import UploadFile from "./UploadFile";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import ModalConfirm from "./Modal"; // Ubah nama import agar lebih jelas
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
export default function DataTable({ columns, dataTitle, data, totalPages, isLoading, currentLimit, currentPage, onFetch, onDelete, onUpload, onSearch }) {
  const { showNotification } = useNotificationStore();
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const nextPage = () => {
    if (currentPage < totalPages) {
      onFetch(searchTerm, currentPage + 1, currentLimit);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onFetch(searchTerm, currentPage - 1, currentLimit);
    }
  };

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value);
    onFetch(searchTerm, currentPage, newLimit);
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      showNotification("Data berhasil dihapus", "success");
      onFetch("", 1, currentLimit);
    } catch (error) {
      showNotification(error.message || "terjadi kesalahan", "error");
    }
  };

  const handleInputSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler saat tekan Enter atau Klik Tombol Cari
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onFetch(searchTerm, 1, currentLimit);
  };

  useEffect(() => {
    onFetch(searchTerm, currentPage, currentLimit);
  }, []);

  const totalHalaman = totalPages.toLocaleString("id-ID");

  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1, // Memastikan di atas elemen lain
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Mengatur kegelapan latar (0.7 = 70%)
        }}
        open={isLoading} // Muncul hanya saat loading true
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" component="div">
          Mohon Tunggu...
        </Typography>
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Mengunci Box agar tidak ikut melebar
      }}
    >
      <div className="flex flex-row justify-between mb-4 mx-2 ">
        <Typography variant="h6" sx={{ flexShrink: 0 }}>
          {dataTitle}
        </Typography>
        <form onSubmit={handleSearch} className="flex gap-2">
          <TextField
            size="small"
            placeholder="Cari data..."
            value={searchTerm}
            onChange={handleInputSearch}
            sx={{ width: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <UploadFile open={openModal} setOpen={setOpenModal} onUpload={onUpload} />
          <Button onClick={() => setOpenDelete(true)} color="error" variant="contained" startIcon={<DeleteIcon fontSize="small" />} size="small" disabled={!data || data.length === 0}>
            Hapus Data
          </Button>
        </form>
      </div>
      <ModalConfirm open={openDelete} onClose={() => setOpenDelete(false)} onConfirm={handleDelete} />

      <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead sx={{ whiteSpace: "nowrap" }}>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>
                  {col.header} {/* Menampilkan Judul */}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow sx={{ whiteSpace: "nowrap" }} key={rowIndex} hover>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {/* Render custom jika ada, jika tidak tampilkan key berdasarkan accessor */}
                      {col.render ? col.render(row) : row[col.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Container */}
      <Box sx={{ p: 2, flexShrink: 0, borderTop: "1px solid #eee" }}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-2 ">
            <label className="text-sm">Tampilkan:</label>
            <select value={currentLimit} onChange={handleLimit} className="rounded border border-stroke bg-transparent py-1 px-2 outline-none focus:border-primary dark:border-strokedark">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm">data per halaman</span>
          </div>
          <div className="flex flex-row gap-8 justify-end items-center">
            <div className="text-sm">
              halaman <span>{currentPage}</span> dari <span>{totalHalaman}</span>
            </div>
            <div className="flex gap-2">
              <button
                className={`flex items-center justify-center p-1 rounded border transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-400 "}`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <NavigateBeforeIcon />
              </button>

              {/* Tombol Next */}
              <button
                className={`flex items-center justify-center p-1 rounded border transition-colors ${currentPage >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-400 "}`}
                onClick={nextPage}
                disabled={currentPage >= totalPages}
              >
                <NavigateNextIcon />
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
