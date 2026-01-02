import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { usePtkStore } from "../../../stores/usePtkStore";
import { useEffect, useState } from "react";

const COLUMNS = ["ID PTK", "NAMA LENGKAP", "ID SEKOLAH", "NIP", "JENIS KELAMIN", "TEMPAT LAHIR", "NIK", "STATUS"];

export default function PtkTable() {
  const { fetchPtk, ptkData, isLoading, totalPages, currentPage } = usePtkStore();

  console.log("render tabel ptk");

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchPtk(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchPtk(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchPtk(currentPage);
  }, []);

  const rows = Array.isArray(ptkData) ? ptkData : [];
  const totalHalaman = totalPages.toLocaleString("id-ID");

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Memuat data...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Mengunci Box agar tidak ikut melebar
      }}
    >
      <Typography variant="h6" sx={{ p: 2, mb: 0, flexShrink: 0 }}>
        Data PTK
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          width: "100%", // Mengunci lebar sesuai Box
          overflowX: "auto", // Scroll horizontal hanya di sini
          overflowY: "auto", // Scroll vertikal hanya di sini
          boxShadow: "none",
          borderRadius: 0,
        }}
      >
        <Table stickyHeader sx={{ minWidth: 1200 }}>
          {/* minWidth besar memaksa scroll horizontal muncul di dalam TableContainer */}
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "grey.100",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={row?.ptk_id || index} hover>
                  <TableCell>{row?.ptk_id}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{row?.nama}</TableCell>
                  <TableCell>{row?.sekolah_id}</TableCell>
                  <TableCell>{row?.nip}</TableCell>
                  <TableCell>{row?.jenis_kelamin}</TableCell>
                  <TableCell>{row?.tempat_lahir}</TableCell>
                  <TableCell>{row?.nik}</TableCell>
                  <TableCell>{row?.status_kepegawaian}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination tetap di bawah dan tidak bergeser */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", flexShrink: 0 }}>
        <div className="flex flex-row gap-8 justify-end items-center">
          <div className="text-sm">
            halaman <span className="text-red-600 font-bold">{currentPage}</span> dari <span className="text-red-600 font-bold">{totalHalaman}</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={prevPage}>
              Prev
            </button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={nextPage}>
              Next
            </button>
          </div>
        </div>
      </Box>
    </Box>
  );
}
