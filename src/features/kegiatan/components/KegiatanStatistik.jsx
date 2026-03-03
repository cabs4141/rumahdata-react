import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Chip, CircularProgress, Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useKegiatanStore } from "@/features/kegiatan/stores/useKegiatanStore";
import { usePesertaStore } from "@/features/pemetaan/stores/usePesertaStore";
import { ChartCard } from "@/pages/DataPage/Statistik/components/SharedComponents";
import NTBMap from "@/features/kegiatan/components/NTBMap";

// ─── Color Palette ────────────────────────────────────────────────────────────
const GURU_COLOR = "#2C3E6B";
const KEPSEK_COLOR = "#F97316";

const JENJANG_ORDER = ["PAUD", "PNF", "SD", "SLB", "SMA", "SMK", "SMP"];
const JENJANG_COLORS = ["#06B6D4", "#EAB308", "#8B5CF6", "#EF4444", "#3B82F6", "#F97316", "#22C55E"];

const KAB_GRADIENT = ["#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#7DD3FC", "#93C5FD", "#BAE6FD", "#DBEAFE", "#E0F2FE", "#F0F9FF"];

// ─── Data Processors ─────────────────────────────────────────────────────────
const computeJabatanPerJenjang = (peserta) => {
  const map = {};
  peserta.forEach((p) => {
    const j = (p.jenjang || "LAINNYA").toUpperCase().trim();
    const jab = (p.jabatan || p.peran || "").toUpperCase().trim();
    if (!map[j]) map[j] = { guru: 0, kepsek: 0 };
    if (jab.includes("KEPALA")) map[j].kepsek++;
    else map[j].guru++;
  });
  const labels = JENJANG_ORDER.filter((j) => map[j]);
  Object.keys(map).forEach((j) => {
    if (!JENJANG_ORDER.includes(j)) labels.push(j);
  });
  return {
    labels,
    guru: labels.map((j) => {
      const g = map[j]?.guru || 0;
      const k = map[j]?.kepsek || 0;
      const total = g + k;
      return total === 0 ? 0 : Number(((g / total) * 100).toFixed(1));
    }),
    kepsek: labels.map((j) => {
      const g = map[j]?.guru || 0;
      const k = map[j]?.kepsek || 0;
      const total = g + k;
      return total === 0 ? 0 : Number(((k / total) * 100).toFixed(1));
    }),
  };
};

const computeInstansi = (peserta) => {
  const counts = {};
  peserta.forEach((p) => {
    const raw = (p.kabupaten || "Tidak Diketahui").trim();
    counts[raw] = (counts[raw] || 0) + 1;
  });

  // Urutkan descending, batasi top 10
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top10 = sorted.slice(0, 10);
  const rest = sorted.slice(10);

  if (rest.length > 0) {
    const lainnya = rest.reduce((s, e) => s + e[1], 0);
    top10.push(["Lainnya", lainnya]);
  }

  return {
    labels: top10.map((e) => e[0]),
    data: top10.map((e) => e[1]),
    total: sorted.reduce((s, e) => s + e[1], 0),
  };
};

const computeJenjangProporsi = (peserta) => {
  const counts = {};
  peserta.forEach((p) => {
    const j = (p.jenjang || "LAINNYA").toUpperCase().trim();
    counts[j] = (counts[j] || 0) + 1;
  });
  const result = [];
  JENJANG_ORDER.forEach((j, i) => {
    if (counts[j]) result.push({ id: j, label: j, value: counts[j], color: JENJANG_COLORS[i] });
  });
  Object.keys(counts).forEach((j) => {
    if (!JENJANG_ORDER.includes(j)) result.push({ id: j, label: j, value: counts[j], color: "#94A3B8" });
  });
  return result;
};

// ─── Heatmap Processor ──────────────────────────────────────────────────────
const computeHeatmap = (peserta) => {
  // Wilayah (kabupaten) – top 12 by total count
  const wilayahCount = {};
  peserta.forEach((p) => {
    const w = (p.kabupaten || "Tidak Diketahui").trim();
    wilayahCount[w] = (wilayahCount[w] || 0) + 1;
  });
  const topWilayah = Object.entries(wilayahCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map((e) => e[0]);

  // Jenjang columns
  const jenjangSet = new Set();
  peserta.forEach((p) => {
    if (p.jenjang) jenjangSet.add(p.jenjang.toUpperCase().trim());
  });
  const columns = JENJANG_ORDER.filter((j) => jenjangSet.has(j));
  [...jenjangSet].forEach((j) => {
    if (!JENJANG_ORDER.includes(j)) columns.push(j);
  });

  // Build matrix  map[wilayah][jenjang] = count
  const matrix = {};
  topWilayah.forEach((w) => {
    matrix[w] = {};
    columns.forEach((j) => {
      matrix[w][j] = 0;
    });
  });
  peserta.forEach((p) => {
    const w = (p.kabupaten || "Tidak Diketahui").trim();
    const j = (p.jenjang || "").toUpperCase().trim();
    if (matrix[w] && j && matrix[w][j] !== undefined) matrix[w][j]++;
  });

  const maxVal = Math.max(1, ...topWilayah.flatMap((w) => columns.map((j) => matrix[w][j])));
  return { rows: topWilayah, columns, matrix, maxVal };
};

// ─── Heatmap Component ────────────────────────────────────────────────────────
const heatColor = (val, maxVal) => {
  if (val === 0) return { bg: "#F8FAFC", text: "#CBD5E1" };
  const intensity = val / maxVal; // 0..1
  // Blue scale: light → dark
  const r = Math.round(219 - intensity * 174); // 219→45
  const g = Math.round(234 - intensity * 175); // 234→59
  const b = Math.round(254 - intensity * 55); // 254→199
  const textLight = intensity > 0.55;
  return {
    bg: `rgb(${r},${g},${b})`,
    text: textLight ? "#fff" : "#1E3A8A",
  };
};

const HeatmapMatrix = ({ data }) => {
  const { rows, columns, matrix, maxVal } = data;
  if (!rows.length || !columns.length) return null;

  const CELL_W = 120;
  const CELL_H = 48;
  const ROW_LBL = 220;

  return (
    <Box sx={{ overflowX: "auto", width: "100%" }}>
      <Box sx={{ minWidth: ROW_LBL + columns.length * CELL_W + 16 }}>
        {/* Header row */}
        <Box sx={{ display: "flex", mb: 0.5, ml: `${ROW_LBL}px` }}>
          {columns.map((col) => (
            <Box
              key={col}
              sx={{
                width: CELL_W,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#475569",
                flexShrink: 0,
                px: 0.5,
              }}
            >
              {col}
            </Box>
          ))}
        </Box>

        {/* Data rows */}
        {rows.map((row) => (
          <Box key={row} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            {/* Row label */}
            <Box
              sx={{
                width: ROW_LBL,
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                pr: 1,
                textAlign: "right",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={row}
            >
              {row}
            </Box>

            {/* Cells */}
            {columns.map((col) => {
              const val = matrix[row][col];
              const { bg, text } = heatColor(val, maxVal);
              return (
                <Box
                  key={col}
                  title={`${row} × ${col}: ${val} peserta`}
                  sx={{
                    width: CELL_W,
                    height: CELL_H,
                    flexShrink: 0,
                    bgcolor: bg,
                    color: text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: val > 0 ? 700 : 400,
                    borderRadius: 1,
                    mx: 0.25,
                    transition: "transform 0.15s, opacity 0.15s",
                    cursor: val > 0 ? "default" : "default",
                    "&:hover": val > 0 ? { opacity: 0.85, transform: "scale(1.08)" } : {},
                  }}
                >
                  {val > 0 ? val : ""}
                </Box>
              );
            })}
          </Box>
        ))}

        {/* Legend */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 2, ml: `${ROW_LBL}px` }}>
          <Typography variant="caption" color="text.secondary" mr={1}>
            Rendah
          </Typography>
          {[0.1, 0.3, 0.5, 0.7, 0.9, 1.0].map((v) => {
            const { bg } = heatColor(v * maxVal, maxVal);
            return <Box key={v} sx={{ width: 28, height: 16, bgcolor: bg, borderRadius: 0.5 }} />;
          })}
          <Typography variant="caption" color="text.secondary" ml={1}>
            Tinggi
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
  <Box sx={{ textAlign: "center", py: 8, bgcolor: "white", borderRadius: 2, border: "1px dashed #E2E8F0" }}>
    <BarChartIcon sx={{ fontSize: 48, color: "#CBD5E1", mb: 1 }} />
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const KegiatanStatistik = () => {
  const { kegiatanData, getKegiatan, isFetching: loadingKegiatan } = useKegiatanStore();
  const { fetchAllPeserta, getPesertaByKegiatan, allPeserta, isFetching: loadingPeserta } = usePesertaStore();
  const [selectedKegiatan, setSelectedKegiatan] = useState("");

  useEffect(() => {
    getKegiatan({ page: 1, limit: 100 });
    if (allPeserta.length === 0) fetchAllPeserta();
  }, [getKegiatan, fetchAllPeserta]);

  const displayPeserta = useMemo(() => {
    if (!selectedKegiatan) return [];
    return getPesertaByKegiatan(selectedKegiatan);
  }, [selectedKegiatan, getPesertaByKegiatan, allPeserta]);

  const jabatanData = useMemo(() => computeJabatanPerJenjang(displayPeserta), [displayPeserta]);
  const instansiData = useMemo(() => computeInstansi(displayPeserta), [displayPeserta]);
  const jenjangPie = useMemo(() => computeJenjangProporsi(displayPeserta), [displayPeserta]);
  const heatmapData = useMemo(() => computeHeatmap(displayPeserta), [displayPeserta]);

  const hasData = displayPeserta.length > 0;
  const kabHeight = Math.max(380, instansiData.labels.length * 52 + 80);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" color="#1C2434" mb={0.5}>
        Statistik Kegiatan
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Pilih kegiatan untuk melihat grafik distribusi pesertanya.
      </Typography>

      {/* ── Selector ─────────────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          bgcolor: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 320 }}>
          <InputLabel id="kegiatan-select-label">Pilih Kegiatan</InputLabel>
          <Select labelId="kegiatan-select-label" value={selectedKegiatan} label="Pilih Kegiatan" onChange={(e) => setSelectedKegiatan(e.target.value)} disabled={loadingKegiatan}>
            <MenuItem value="">
              <em>Silakan Pilih...</em>
            </MenuItem>
            {kegiatanData.map((keg) => (
              <MenuItem key={keg.id} value={keg.id}>
                {keg.nama_kegiatan} ({new Date(keg.tanggal_mulai).getFullYear()})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedKegiatan && hasData && <Chip label={`${displayPeserta.length.toLocaleString()} Peserta`} color="primary" size="small" variant="outlined" />}
      </Paper>

      {loadingPeserta && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={32} />
        </Box>
      )}

      {!loadingPeserta && (
        <>
          {!selectedKegiatan ? (
            <EmptyState message="Silakan pilih kegiatan pada kotak di atas untuk memulai." />
          ) : !hasData ? (
            <EmptyState message="Belum ada peserta untuk kegiatan ini." />
          ) : (
            <Grid container spacing={4}>
              {/* ── Chart 1: Keseimbangan Jabatan per Jenjang ───────── */}
              <ChartCard title="Keseimbangan Peran Jabatan per Jenjang" xs={12} height={460}>
                <Box width="100%">
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Persentase Guru vs Kepala Sekolah berdasarkan Jenjang
                  </Typography>
                  <BarChart
                    height={400}

                    series={[
                      { id: "guru", label: "GURU", data: jabatanData.guru, color: GURU_COLOR, stack: "total", valueFormatter: (v) => `${v}%` },
                      { id: "kepsek", label: "KEPALA SEKOLAH", data: jabatanData.kepsek, color: KEPSEK_COLOR, stack: "total", valueFormatter: (v) => `${v}%` },
                    ]}
                    barLabel={(item, context) => {
                      if (item.value === null || item.value === undefined || item.value === 0) return null;
                      return `${item.value}%`;
                    }}
                    xAxis={[
                      {
                        scaleType: "band",
                        data: jabatanData.labels,
                        label: "Jenjang",
                        tickLabelStyle: { fill: "#64748B", fontSize: 12 },
                      },
                    ]}
                    yAxis={[
                      {
                        label: "Persentase (%)",
                        tickLabelStyle: { fill: "#64748B", fontSize: 11 },
                        valueFormatter: (v) => `${v}%`,
                        min: 0,
                        max: 100,
                      },
                    ]}
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    slotProps={{ legend: { position: { vertical: "bottom", horizontal: "middle" }, padding: { top: 2 } } }}
                    sx={{
                      "& .MuiBarLabel-root": {
                        fill: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: "bold",
                      },
                    }}
                    tooltip={{ trigger: "item" }}
                  />
                </Box>
              </ChartCard>

              {/* ── Chart 2: Total Peserta per Kabupaten/Kota ────────── */}
              <ChartCard title="Total Peserta PM per Kabupaten/Kota" xs={12} height={kabHeight + 60}>
                <Box width="100%" height={kabHeight}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Visualisasi berdasarkan volume partisipasi tertinggi
                  </Typography>
                  <BarChart
                    layout="horizontal"
                    height={kabHeight}
                    series={[
                      {
                        id: "kab",
                        label: "Jumlah Peserta",
                        data: instansiData.data,
                        color: "#3B82F6",
                      },
                    ]}
                    yAxis={[
                      {
                        scaleType: "band",
                        data: instansiData.labels,
                        tickLabelStyle: { fill: "#374151", fontSize: 11 },
                      },
                    ]}
                    xAxis={[
                      {
                        label: "Jumlah Peserta",
                        tickLabelStyle: { fill: "#64748B", fontSize: 11 },
                      },
                    ]}
                    margin={{ top: 10, right: 40, bottom: 50, left: 110 }}
                    barLabel={(item) => (item.value ? item.value.toString() : "")}
                    slotProps={{ legend: { hidden: true } }}
                    tooltip={{ trigger: "item" }}
                    colors={instansiData.data.map((_, i) => KAB_GRADIENT[Math.min(i, KAB_GRADIENT.length - 1)])}
                    sx={{
                      width: '100%',
                      "& .MuiBarLabel-root": {
                        fill: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Box>
              </ChartCard>

              {/* ── Chart 3: Proporsi Jenjang (Batang) ───────────────── */}
              <ChartCard title="Proporsi Sekolah Berdasarkan Jenjang" xs={12} height={460}>
                <Box width="100%">
                  <BarChart
                    height={400}
                    series={[
                      {
                        label: "Jumlah Sekolah",
                        data: jenjangPie.map((item) => item.value),
                        color: "#14B8A6",
                      },
                    ]}
                    xAxis={[
                      {
                        scaleType: "band",
                        data: jenjangPie.map((item) => item.label),
                        tickLabelStyle: { fill: "#64748B", fontSize: 12 },
                      },
                    ]}
                    yAxis={[
                      {
                        label: "Jumlah",
                        tickLabelStyle: { fill: "#64748B", fontSize: 11 },
                      },
                    ]}
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    slotProps={{ legend: { hidden: true } }}
                    tooltip={{ trigger: "item" }}
                  />
                </Box>
              </ChartCard>

              {/* ── Chart 4: Matriks Kerapatan Partisipasi ──────────── */}
              <ChartCard title="Matriks Kerapatan Partisipasi" xs={12} height="auto">
                <Box width="100%">
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Hubungan antara wilayah geografis dan jenjang pendidikan peserta
                  </Typography>
                  <HeatmapMatrix data={heatmapData} />
                </Box>
              </ChartCard>

              {/* ── Chart 5: Peta Kerapatan Wilayah NTB ────────── */}
              <ChartCard title="Peta Distribusi Peserta Pembelajaran Mendalam Berdasarkan Jenjang" xs={12} height={520}>
                <Box width="100%">
                  <NTBMap peserta={displayPeserta} />
                </Box>
              </ChartCard>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default KegiatanStatistik;
