import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";

import UploadFile from "./UploadFile";
import ModalDetailUser from "./ModalDetailUser";
import ModalDetailSekolah from "./ModalDetailSekolah";
import ModalConfirm from "./Modal";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { jwtDecode } from "jwt-decode";
import { useNotificationStore } from "../../stores/useNotifStore";
import { useUserStore } from "../../stores/useUserStore";
import { useSekolahStore } from "../../stores/useSekolahStore";

const DataTable = ({ isFetching, columns, dataTitle, data, totalPages, isLoading, currentLimit, currentPage, onFetch, onDelete, onUpload, initialSearch = "" }) => {
  const { showNotification } = useNotificationStore();
  const { token, getUserDetail, clearSelectedUser } = useUserStore();
  const { getSekolahDetail } = useSekolahStore();

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [open, setOpen] = useState(false);
  const [openSekolah, setOpenSekolah] = useState(false);

  const totalHalaman = totalPages ? totalPages?.toLocaleString("id-ID") : "0";
  const isSekolah = dataTitle?.toLowerCase().includes("sekolah");
  const isDataUser = dataTitle?.toLowerCase().includes("user");
  const decoded = jwtDecode(token);
  const userRole = decoded?.role;
  const isUserRole = userRole == "user";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const targetPage = searchTerm ? 1 : currentPage;
      onFetch(searchTerm, targetPage, currentLimit);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
    onFetch(searchTerm, 1, newLimit);
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

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onFetch(searchTerm, 1, currentLimit);
  };

  const handleOpenModal = useCallback(
    async (row) => {
      if (isDataUser) {
        try {
          await getUserDetail(row.id);
          setOpen(true);
        } catch (err) {
          showNotification("Gagal mengambil detail user", "error");
          console.log(err);
        }
      } else {
        setOpen(true);
      }
    },
    [isDataUser, getUserDetail, showNotification],
  );

  const handleCloseModal = () => {
    setOpen(false);
    clearSelectedUser();
  };

  const handleSekolahDetail = useCallback(
    async (row) => {
      try {
        await getSekolahDetail(row.sekolah_id);
        setOpenSekolah(true);
      } catch (error) {
        console.log("error func", error);
      }
    },
    [getSekolahDetail],
  );

  const handleCloseModalSekolah = () => {
    setOpenSekolah(false);
  };

  const TableContent = useMemo(() => {
    return (
      <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead sx={{ whiteSpace: "nowrap" }}>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index} sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              [...Array(currentLimit || 5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton variant="text" animation="wave" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} hover onClick={() => isDataUser && handleOpenModal(row)} sx={{ cursor: isDataUser ? "pointer" : "default", whiteSpace: "nowrap" }}>
                  {columns.map((col, colIndex) => (
                    <TableCell onClick={() => isSekolah && handleSekolahDetail(row)} className={isSekolah ? "cursor-pointer" : ""} key={colIndex}>
                      {isSekolah ? (
                        <Tooltip title="Klik untuk lihat detail sekolah" arrow>
                          {/* Bungkus span agar tooltip bekerja sempurna */}
                          <span>{col.render ? col.render(row, rowIndex) : row[col.accessor]}</span>
                        </Tooltip>
                      ) : col.render ? (
                        col.render(row, rowIndex)
                      ) : (
                        row[col.accessor]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                  <Typography color="textSecondary">Data tidak ditemukan</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [isFetching, data, columns, currentLimit, isDataUser, isSekolah, handleOpenModal, handleSekolahDetail]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={isLoading}
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
        overflow: "hidden",
      }}
    >
      <div className="flex flex-row justify-between mb-4 mx-2 ">
        <Typography variant="h6" sx={{ flexShrink: 0 }}>
          {dataTitle}
        </Typography>

        {isDataUser ? (
          <TextField
            size="small"
            placeholder="cari user..."
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
        ) : (
          <form onSubmit={handleSearch} className="flex gap-2">
            <TextField
              size="small"
              placeholder="cari data..."
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

            {isUserRole !== true ? (
              <>
                <UploadFile open={openModal} setOpen={setOpenModal} onUpload={onUpload} />
                <Button onClick={() => setOpenDelete(true)} color="error" variant="contained" startIcon={<DeleteIcon fontSize="small" />} size="small" disabled={!data || data.length === 0}>
                  Hapus Data
                </Button>
              </>
            ) : (
              <div />
            )}
          </form>
        )}
      </div>

      <ModalConfirm
        title={" Apakah Anda yakin ingin menghapus seluruh data? Tindakan ini tidak dapat dibatalkan dan semua data yang ada di tabel ini akan hilang secara permanen."}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
      <ModalDetailUser isOpen={open} handleClose={handleCloseModal} onRefresh={() => onFetch(searchTerm, currentPage, currentLimit)} />
      <ModalDetailSekolah open={openSekolah} handleClose={handleCloseModalSekolah} />

      {/* Render Tabel yang sudah di-memoize */}
      {TableContent}

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
                className={`flex items-center justify-center p-1 rounded border transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 "}`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <NavigateBeforeIcon />
              </button>

              <button
                className={`flex items-center justify-center p-1 rounded border transition-colors ${currentPage >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 "}`}
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
};

// Bungkus dengan memo untuk optimasi extra di level parent
export default memo(DataTable);
