import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, CircularProgress, Grid, Divider, Avatar, alpha } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import FilterListIcon from "@mui/icons-material/FilterList";
import SchoolIcon from "@mui/icons-material/School";

import { useKegiatanStore } from "@/features/kegiatan/stores/useKegiatanStore";
import { usePesertaStore } from "@/features/pemetaan/stores/usePesertaStore";
import { usePtkStore } from "@/features/ptk/stores/usePtkStore";

import { ChartCard, ResizableChart } from "@/pages/DataPage/Statistik/components/SharedComponents";
import NTBMap from "@/features/kegiatan/components/NTBMap";

// ─── Color Palette ────────────────────────────────────────────────────────────
const GURU_COLOR = "#2C3E6B";
const KEPSEK_COLOR = "#F97316";

const JENJANG_ORDER = ["PAUD", "SD", "SMP", "SMA", "SMK", "SLB", "PNF"];
const JENJANG_COLORS = ["#06B6D4", "#8B5CF6", "#22C55E", "#3B82F6", "#F97316", "#EF4444", "#EAB308"];



// ─── Data Processors ─────────────────────────────────────────────────────────
const computeJabatanPerJenjang = (peserta) => {
  const map = {};
  peserta.forEach((p) => {
    const raw = (p.jenjang || "").toUpperCase().trim();
    if (!raw) return; // skip if no jenjang
    const jab = (p.jabatan || p.peran || "").toUpperCase().trim();
    if (!map[raw]) map[raw] = { guru: 0, kepsek: 0 };
    if (jab.includes("KEPALA")) map[raw].kepsek++;
    else map[raw].guru++;
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
    // raw absolute counts per jenjang (for tooltip)
    guruRaw: labels.map((j) => map[j]?.guru || 0),
    kepsekRaw: labels.map((j) => map[j]?.kepsek || 0),
    rawTotals: labels.map((j) => (map[j]?.guru || 0) + (map[j]?.kepsek || 0)),
  };
};

const computeInstansiJabatan = (peserta) => {
  const counts = {};
  peserta.forEach((p) => {
    const kab = (p.kabupaten || "").trim();
    if (!kab) return;
    const jab = (p.jabatan || p.peran || "").toUpperCase().trim();
    if (!counts[kab]) counts[kab] = { guru: 0, kepsek: 0 };
    if (jab.includes("KEPALA")) counts[kab].kepsek++;
    else counts[kab].guru++;
  });
  const sorted = Object.entries(counts)
    .map(([kab, { guru, kepsek }]) => ({ kab, guru, kepsek, total: guru + kepsek }))
    .sort((a, b) => b.total - a.total);
  return {
    labels: sorted.map((e) => e.kab.toUpperCase()),
    guru: sorted.map((e) => e.guru),
    kepsek: sorted.map((e) => e.kepsek),
  };
};

const computeJenjangProporsi = (peserta) => {
  const counts = {};
  peserta.forEach((p) => {
    const j = (p.jenjang || "").toUpperCase().trim();
    if (!j) return; // skip if no jenjang
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

const buildKabupatenJabatanOptions = (labels) => ({
  chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
  colors: ["#2563EB", "#EA580C"],
  plotOptions: {
    bar: { horizontal: true, borderRadius: 0, barHeight: "75%", dataLabels: { position: "center" } },
  },
  dataLabels: {
    enabled: true,
    style: { fontSize: "11px", fontWeight: 700, colors: ["#fff"] },
    formatter: (val) => (val > 0 ? val.toLocaleString("id-ID") : ""),
    dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.3 },
  },
  xaxis: {
    categories: labels,
    title: { text: "Jumlah Peserta", style: { color: "#64748B", fontSize: "12px" } },
    labels: { style: { colors: "#64748B", fontSize: "12px" }, formatter: (v) => v.toLocaleString("id-ID") },
  },
  yaxis: {
    labels: { style: { colors: "#374151", fontSize: "12px" }, maxWidth: 220 },
  },
  legend: {
    position: "bottom",
    title: { text: "Jabatan", style: { fontWeight: 600, color: "#374151" } },
    labels: { colors: "#374151" },
    markers: { radius: 0 },
  },
  grid: { borderColor: "#F1F5F9", strokeDashArray: 3, padding: { right: 20 } },
  tooltip: {
    theme: "light",
    y: { formatter: (val) => val.toLocaleString("id-ID") },
  },
});


// ─── Jabatan Stacked Chart Options (ApexCharts) ──────────────────────────────
const buildJabatanOptions = (labels, guruRaw, kepsekRaw) => ({
  chart: {
    type: "bar",
    stacked: true,
    stackType: "100%",
    toolbar: { show: false },
    fontFamily: "Outfit, sans-serif",
    animations: { enabled: false },
  },
  colors: [GURU_COLOR, KEPSEK_COLOR],
  plotOptions: {
    bar: { horizontal: false, borderRadius: 0, columnWidth: "80%" },
  },
  dataLabels: {
    enabled: true,
    formatter: (val, opts) => {
      if (val < 5) return "";
      const idx = opts.dataPointIndex;
      const si = opts.seriesIndex;
      const count = (si === 0 ? guruRaw[idx] : kepsekRaw[idx]) || 0;
      return [`${val.toFixed(1)}%`, `(${count.toLocaleString("id-ID")})`];
    },
    style: { fontSize: "11px", fontWeight: 700, colors: ["#fff"] },
    dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.3 },
  },
  xaxis: {
    categories: labels,
    labels: { style: { colors: "#64748B", fontSize: "12px" } },
  },
  yaxis: {
    labels: { formatter: (v) => `${v.toFixed(0)}%`, style: { colors: "#64748B", fontSize: "11px" } },
    max: 100,
    title: { text: "Persentase (%)", style: { color: "#64748B", fontSize: "12px" } },
  },
  legend: {
    position: "bottom",
    labels: { colors: "#374151" },
    markers: { radius: 2 },
  },
  grid: { borderColor: "#F1F5F9", strokeDashArray: 3 },
  tooltip: {
    custom: ({ series, dataPointIndex }) => {
      const gPct = (series[0]?.[dataPointIndex] ?? 0).toFixed(1);
      const kPct = (series[1]?.[dataPointIndex] ?? 0).toFixed(1);
      const gCount = (guruRaw[dataPointIndex] || 0).toLocaleString("id-ID");
      const kCount = (kepsekRaw[dataPointIndex] || 0).toLocaleString("id-ID");
      const totalCount = ((guruRaw[dataPointIndex] || 0) + (kepsekRaw[dataPointIndex] || 0)).toLocaleString("id-ID");
      const lbl = labels[dataPointIndex] || "";
      return `
        <div style="padding:10px 14px;font-family:Outfit,sans-serif;font-size:13px;min-width:220px">
          <div style="font-weight:700;color:#0f172a;margin-bottom:8px;border-bottom:1px solid #e2e8f0;padding-bottom:6px">${lbl}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
            <span style="display:flex;align-items:center;gap:6px">
              <span style="width:10px;height:10px;background:${GURU_COLOR};display:inline-block;border-radius:2px"></span>
              <span style="color:#374151;font-weight:600">Guru</span>
            </span>
            <span style="font-weight:700;color:${GURU_COLOR}">${gCount} <span style="color:#94a3b8;font-weight:400;font-size:11px">(${gPct}%)</span></span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="display:flex;align-items:center;gap:6px">
              <span style="width:10px;height:10px;background:${KEPSEK_COLOR};display:inline-block;border-radius:2px"></span>
              <span style="color:#374151;font-weight:600">Kepala Sekolah</span>
            </span>
            <span style="font-weight:700;color:${KEPSEK_COLOR}">${kCount} <span style="color:#94a3b8;font-weight:400;font-size:11px">(${kPct}%)</span></span>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:7px;display:flex;justify-content:space-between">
            <span style="color:#64748b;font-size:12px">Total</span>
            <span style="font-weight:700;color:#0f172a">${totalCount}</span>
          </div>
        </div>`;
    },
  },
});


// ─── Heatmap Processor ──────────────────────────────────────────────────────
const computeHeatmap = (peserta) => {
  // Wilayah (kabupaten) – alphabetical
  const wilayahCount = {};
  peserta.forEach((p) => {
    const w = (p.kabupaten || "").trim();
    if (!w) return; // skip if no kabupaten
    wilayahCount[w] = (wilayahCount[w] || 0) + 1;
  });
  const topWilayah = Object.keys(wilayahCount).sort((a, b) => a.localeCompare(b));

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
  let grandTotal = 0;
  peserta.forEach((p) => {
    const w = (p.kabupaten || "Tidak Diketahui").trim();
    const j = (p.jenjang || "").toUpperCase().trim();
    if (matrix[w] && j && matrix[w][j] !== undefined) {
      matrix[w][j]++;
      grandTotal++;
    }
  });

  const maxVal = Math.max(1, ...topWilayah.flatMap((w) => columns.map((j) => matrix[w][j])));
  return { rows: topWilayah, columns, matrix, maxVal, grandTotal };
};

// ─── Heatmap Component ────────────────────────────────────────────────────────
const heatColor = (val, maxVal) => {
  if (val === 0) return { bg: "#F8FAFC", text: "#e2e8f0" };
  const intensity = val / maxVal; // 0..1

  // Color gradient: emerald-100 to emerald-900
  const r = Math.round(209 - intensity * (209 - 6));
  const g = Math.round(250 - intensity * (250 - 78));
  const b = Math.round(229 - intensity * (229 - 59));

  const textLight = intensity > 0.4;
  return {
    bg: `rgb(${r},${g},${b})`,
    text: textLight ? "#ffffff" : "#022c22",
  };
};

const HeatmapMatrix = ({ data }) => {
  const { rows, columns, matrix, maxVal, grandTotal } = data;
  if (!rows.length || !columns.length) return null;

  // Calculate Column Totals
  const colTotals = {};
  columns.forEach(col => {
    colTotals[col] = rows.reduce((acc, row) => acc + (matrix[row][col] || 0), 0);
  });

  // Calculate Row Totals
  const rowTotals = {};
  rows.forEach(row => {
    rowTotals[row] = columns.reduce((acc, col) => acc + (matrix[row][col] || 0), 0);
  });

  const CELL_H = 40;
  const ROW_LBL = 140;

  return (
    <Box sx={{ display: "flex", width: "100%", flexDirection: { xs: "column", lg: "row" }, gap: 3, alignItems: "flex-start" }}>
      <Box sx={{ overflowX: "auto", flex: 1, width: "100%" }}>
        <Box sx={{ minWidth: Math.max(700, ROW_LBL + (columns.length + 1) * 60) }}>

          {/* Top TOTAL Row */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box sx={{
              width: ROW_LBL, flexShrink: 0, fontSize: 11, fontWeight: 700,
              color: "#dc2626", pr: 2, textAlign: "right", letterSpacing: 0.5
            }}>
              TOTAL
            </Box>
            {columns.map(col => (
              <Box key={`top-col-${col}`} sx={{
                flex: 1, height: CELL_H, bgcolor: "#334155", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, mx: 0.25, borderRadius: 0.5
              }}>
                {colTotals[col]}
              </Box>
            ))}
            {/* Grand Total Cell */}
            <Box sx={{
              flex: 1, height: CELL_H, bgcolor: "#b91c1c", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, mx: 0.25, borderRadius: 0.5
            }}>
              {grandTotal}
            </Box>
          </Box>

          {/* Data rows */}
          {rows.map((row) => (
            <Box key={row} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              {/* Row label */}
              <Box
                sx={{
                  width: ROW_LBL, flexShrink: 0, fontSize: 11, fontWeight: 700,
                  color: "#1e293b", pr: 2, textAlign: "right", whiteSpace: "nowrap",
                  overflow: "hidden", textOverflow: "ellipsis", textTransform: "uppercase"
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
                    key={`${row}-${col}`}
                    title={`${row} × ${col}: ${val} peserta`}
                    sx={{
                      flex: 1, height: CELL_H, bgcolor: bg, color: text,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: val > 0 ? 600 : 400, mx: 0.25,
                      borderRadius: 0.5, transition: "transform 0.15s, opacity 0.15s",
                      "&:hover": val > 0 ? { opacity: 0.85, transform: "scale(1.05)", zIndex: 1 } : {},
                    }}
                  >
                    {val > 0 ? val : ""}
                  </Box>
                );
              })}
              {/* Row Total Cell (Right column) */}
              <Box sx={{
                flex: 1, height: CELL_H, bgcolor: "#334155", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, mx: 0.25, borderRadius: 0.5
              }}>
                {rowTotals[row]}
              </Box>
            </Box>
          ))}

          {/* Bottom Labels Row */}
          <Box sx={{ display: "flex", mt: 1 }}>
            <Box sx={{ width: ROW_LBL, flexShrink: 0 }} />
            {columns.map(col => (
              <Box key={`bot-col-${col}`} sx={{
                flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700,
                color: "#1e293b", px: 0.5
              }}>
                {col}
              </Box>
            ))}
            <Box sx={{
              flex: 1, textAlign: "center", fontSize: 11, fontWeight: 700,
              color: "#dc2626", px: 0.5
            }}>
              TOTAL
            </Box>
          </Box>

          {/* X-axis title */}
          <Box sx={{ textAlign: "center", mt: 1, fontSize: 12, color: "#64748b", ml: `${ROW_LBL}px` }}>
            Jenjang Pendidikan
          </Box>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{
        minWidth: 100, display: "flex", flexDirection: "column",
        alignItems: "center", pt: 4
      }}>
        <Typography variant="caption" sx={{ fontSize: 11, color: "#1e293b", mb: 1, fontWeight: 600, textAlign: "center" }}>
          Jumlah Peserta
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", height: 140 }}>
          <Box sx={{
            width: 16, height: "100%",
            background: "linear-gradient(to top, rgba(209,250,229,1), rgba(6,78,59,1))",
            borderRadius: 1, mr: 1, border: "1px solid #e2e8f0"
          }} />
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", py: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{maxVal}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: "#64748b" }}>{Math.round(maxVal / 2)}</Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: "#64748b" }}>0</Typography>
          </Box>
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
  const { ptkStatistik, getStatistikPtk, isStatistikLoading: loadingPtk } = usePtkStore();

  const [selectedTahun, setSelectedTahun] = useState("");
  const [selectedKegiatan, setSelectedKegiatan] = useState("");

  useEffect(() => {
    getKegiatan({ page: 1, limit: 100 });
    getStatistikPtk();
    if (allPeserta.length === 0) fetchAllPeserta();
  }, [getKegiatan, getStatistikPtk, fetchAllPeserta]);

  // Compute PTK Totals
  const { totalGuru, totalKepsek } = useMemo(() => {
    let guru = 0;
    let kepsek = 0;
    ptkStatistik.forEach((ptk) => {
      const jabatan = (ptk.jabatan_ptk || ptk.jenis_ptk || "").toUpperCase();
      if (jabatan.includes("KEPALA")) kepsek++;
      else guru++;
    });
    return { totalGuru: guru, totalKepsek: kepsek };
  }, [ptkStatistik]);

  // Extract available years
  const availableYears = useMemo(() => {
    const years = kegiatanData.map((k) => k.tahun).filter(Boolean);
    return Array.from(new Set(years)).sort((a, b) => b - a); // Descending
  }, [kegiatanData]);

  // Filter Kegiatan based on selectedTahun
  const filteredKegiatan = useMemo(() => {
    if (!selectedTahun) return kegiatanData;
    return kegiatanData.filter((k) => k.tahun === selectedTahun);
  }, [kegiatanData, selectedTahun]);

  useEffect(() => {
    // Reset selected kegiatan if it's no longer in the filtered list
    if (selectedKegiatan && !filteredKegiatan.find((k) => k.id === selectedKegiatan)) {
      setSelectedKegiatan("");
    }
  }, [filteredKegiatan, selectedKegiatan]);

  const displayPeserta = useMemo(() => {
    if (!selectedKegiatan) return [];
    return getPesertaByKegiatan(selectedKegiatan);
  }, [selectedKegiatan, getPesertaByKegiatan, allPeserta]);

  const jabatanData = useMemo(() => computeJabatanPerJenjang(displayPeserta), [displayPeserta]);
  const jabatanOpts = useMemo(
    () => buildJabatanOptions(jabatanData.labels, jabatanData.guruRaw || [], jabatanData.kepsekRaw || []),
    [jabatanData]
  );
  const instansiJabatan = useMemo(() => computeInstansiJabatan(displayPeserta), [displayPeserta]);
  const jenjangPie = useMemo(() => computeJenjangProporsi(displayPeserta), [displayPeserta]);
  const heatmapData = useMemo(() => computeHeatmap(displayPeserta), [displayPeserta]);

  const hasData = displayPeserta.length > 0;

  // ApexCharts options for grouped kabupaten jabatan chart
  const kabJabatanOpts = useMemo(
    () => buildKabupatenJabatanOptions(instansiJabatan.labels),
    [instansiJabatan.labels]
  );
  const kabJabatanHeight = Math.max(400, instansiJabatan.labels.length * 80 + 80);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" color="#2a2a0fff" letterSpacing="-0.02em" mb={0.5}>
          Statistik Peserta Kegiatan
        </Typography>
        <Typography variant="body1" color="#64748b" maxWidth={600}>
          Pantau komposisi tenaga kependidikan secara global dan eksplorasi ringkasan distribusi partisipan berdasarkan agenda kegiatan spesifik.
        </Typography>
      </Box>

      {/* ── Global PTK Information (Premium Bento Grid) ───────────────── */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)" },
            }}
          >
            <Avatar sx={{ bgcolor: alpha("#10b981", 0.1), color: "#10b981", width: 56, height: 56, borderRadius: 3 }}>
              <SchoolIcon fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Total Guru{" "}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 0.5 }}>
                {loadingPtk ? "..." : totalGuru.toLocaleString("id-ID")}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)" },
            }}
          >
            <Avatar sx={{ bgcolor: alpha("#f59e0b", 0.1), color: "#f59e0b", width: 56, height: 56, borderRadius: 3 }}>
              <GroupsIcon fontSize="medium" />
            </Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Total Kepala Sekolah
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 0.5 }}>
                {loadingPtk ? "..." : totalKepsek.toLocaleString("id-ID")}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 5, borderColor: "#e2e8f0" }} />

      {/* ── Controller Section (Filter Tahun + Kegiatan) ────────────────── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="700" color="#1e293b" mb={2}>
          Eksplorasi Data Partisipan
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Filter Tahun */}
          <FormControl size="medium" sx={{ minWidth: { xs: "100%", md: 220 } }}>
            <InputLabel id="tahun-select-label" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterListIcon fontSize="small" /> Filter Tahun
            </InputLabel>
            <Select labelId="tahun-select-label" value={selectedTahun} label="Tahun" onChange={(e) => setSelectedTahun(e.target.value)} disabled={loadingKegiatan} sx={{ borderRadius: 2 }}>
              <MenuItem value="">
                <em>Semua Tahun</em>
              </MenuItem>
              {availableYears.map((tahun) => (
                <MenuItem key={tahun} value={tahun}>
                  Tahun {tahun}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Pemisah Vertikal hanya untuk Desktop */}
          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" }, borderColor: "#e2e8f0" }} />

          {/* Pilih Kegiatan */}
          <FormControl size="medium" sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 320 } }}>
            <InputLabel id="kegiatan-select-label">Pilih Agenda Kegiatan</InputLabel>
            <Select labelId="kegiatan-select-label" value={selectedKegiatan} label="Pilih Agenda Kegiatan" onChange={(e) => setSelectedKegiatan(e.target.value)} disabled={loadingKegiatan} sx={{ borderRadius: 2 }}>
              <MenuItem value="">
                <em>Silakan Pilih...</em>
              </MenuItem>
              {filteredKegiatan.map((keg) => (
                <MenuItem key={keg.id} value={keg.id}>
                  {keg.nama_kegiatan}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>

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
            <>
              {/* ── KPI Summary Cards ─────────────────────────────────────── */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Total Peserta
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="#1E293B">
                      {displayPeserta.length.toLocaleString("id-ID")}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Kepala Sekolah Terlibat
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="#F97316">
                      {displayPeserta.filter((p) => (p.jabatan || p.peran || "").toUpperCase().trim().includes("KEPALA")).length.toLocaleString("id-ID")}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Guru Terlibat
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="#06B6D4">
                      {displayPeserta.filter((p) => !(p.jabatan || p.peran || "").toUpperCase().trim().includes("KEPALA")).length.toLocaleString("id-ID")}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={4}>
                {/* ── Chart 5: Peta Kerapatan Wilayah NTB ────────── */}
                <ChartCard title="Peta Distribusi Peserta Pembelajaran Mendalam Berdasarkan Jenjang" xs={12} height={520}>
                  <Box width="100%">
                    <NTBMap peserta={displayPeserta} />
                  </Box>
                </ChartCard>
                {/* ── Chart 1: Keseimbangan Jabatan per Jenjang ───────── */}
                <ChartCard title="Keseimbangan Peran Jabatan per Jenjang" xs={12} height={460}>
                  <Box width="100%">
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Persentase Guru vs Kepala Sekolah berdasarkan Jenjang — hover untuk detail jumlah
                    </Typography>
                    <ResizableChart
                      options={jabatanOpts}
                      series={[
                        { name: "GURU", data: jabatanData.guru },
                        { name: "KEPALA SEKOLAH", data: jabatanData.kepsek },
                      ]}
                      type="bar"
                      height={400}

                    />
                  </Box>
                </ChartCard>

                {/* ── Chart 2: Distribusi Jabatan per Kabupaten/Kota ──────── */}
                <ChartCard title="Distribusi Jabatan Peserta per Wilayah" xs={12} height={kabJabatanHeight + 100}>
                  <Box width="100%">
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Perbandingan partisipasi Guru dan Kepala Sekolah di setiap Kabupaten/Kota
                    </Typography>
                    <ResizableChart
                      options={kabJabatanOpts}
                      series={[
                        { name: "GURU", data: instansiJabatan.guru },
                        { name: "KEPALA SEKOLAH", data: instansiJabatan.kepsek },
                      ]}
                      type="bar"
                      height={kabJabatanHeight}
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
                          label: "Jumlah Peserta",
                          data: jenjangPie.map((item) => item.value),
                          valueFormatter: (v) => v.toLocaleString("id-ID"),
                        },
                      ]}
                      xAxis={[
                        {
                          scaleType: "band",
                          data: jenjangPie.map((item) => item.label),
                          tickLabelStyle: { fill: "#64748B", fontSize: 12 },
                          colorMap: {
                            type: "ordinal",
                            values: jenjangPie.map((item) => item.label),
                            colors: jenjangPie.map((item) => item.color),
                          },
                        },
                      ]}
                      yAxis={[
                        {
                          label: "Jumlah",
                          tickLabelStyle: { fill: "#64748B", fontSize: 11 },
                          valueFormatter: (v) => v.toLocaleString("id-ID"),
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
                    <HeatmapMatrix data={heatmapData} />
                  </Box>
                </ChartCard>
              </Grid>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default KegiatanStatistik;
