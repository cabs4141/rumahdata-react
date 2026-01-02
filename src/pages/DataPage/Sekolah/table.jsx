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
import { useSekolahStore } from "../../../stores/useSekolahStore";

const COLUMNS = ["ID SEKOLAH", "NAMA SEKOLAH", "NPSN", "BENTUK PENDIDIKAN", "JENJANG", "ALAMAT JALAN", "DESA KELURAHAN", "KECAMATAN", "KABUPATEN", "PROVINSI"];

export default function SekolahTable() {
  const { fetchSekolah, sekolahData, isLoading, totalPages } = useSekolahStore();
  const [page, setPage] = useState(1);

  const nextPage = () => {
    setPage((prev) => prev + 1);
    console.log("next page");
  };

  const prevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
    console.log("next page");
  };

  useEffect(() => {
    fetchSekolah(page);
  }, [fetchSekolah, page]);

  const rows = Array.isArray(sekolahData) ? sekolahData : [];
  const totalHalaman = totalPages.toLocaleString("id-ID");

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Memuat data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Data Sekolah
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              {COLUMNS.map((col) => (
                <TableCell key={col} sx={{ fontWeight: "bold" }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={row.sekolah_id || index} hover>
                  <TableCell>{row.sekolah_id}</TableCell>
                  <TableCell>{row.nama}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{row.npsn}</TableCell>
                  <TableCell>{row.bentuk_pendidikan}</TableCell>
                  <TableCell>{row.jenjang}</TableCell>
                  <TableCell>{row.alamat_jalan}</TableCell>
                  <TableCell>{row.desa_kelurahan}</TableCell>
                  <TableCell>{row.kecamatan}</TableCell>
                  <TableCell>{row.kabupaten}</TableCell>
                  <TableCell>{row.provinsi}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex flex-row gap-8 p-2 justify-end">
        <div className="flex flex-row gap-2">
          halaman
          <p className="text-red-600 ">{page}</p>
          dari
          <p className="text-red-600 ">{totalHalaman}</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white rounded-md px-2 py-0.5" onClick={prevPage}>
            prev
          </button>
          <button className="bg-blue-600 text-white rounded-md px-2 py-0.5" onClick={nextPage}>
            next
          </button>
        </div>
      </div>
    </Box>
  );
}
