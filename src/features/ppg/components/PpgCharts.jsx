import React, { useState, useMemo } from "react";
import {
    Grid, Typography, Box, FormControl, InputLabel,
    Select, MenuItem, Paper
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ChartCard, Loading, NoData, ResizableChart } from "@/pages/DataPage/Statistik/components/SharedComponents";

// ─── Constants & Colors ─────────────────────────────────────────────
const JENJANG_COLORS = {
    PAUD: "#F87171", PKBM: "#D97706", SD: "#65A30D", SKB: "#059669",
    SLB: "#06B6D4", SMA: "#3B82F6", SMK: "#A78BFA", SMP: "#EC4899",
};
const DEFAULT_COLOR = "#94A3B8";

// ─── Option Builders (Sama seperti sebelumnya) ──────────────────────
const buildBarOptions = (labels, colors, title) => ({
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: colors || ["#3B82F6"],
    plotOptions: {
        bar: { distributed: !!colors, borderRadius: 4, columnWidth: "50%", dataLabels: { position: "top" } },
    },
    dataLabels: {
        enabled: true,
        style: { fontSize: "12px", fontWeight: 700, colors: ["#1E293B"] },
        offsetY: -20,
    },
    xaxis: { categories: labels, labels: { style: { colors: "#64748B", fontSize: "11px" } } },
    yaxis: { title: { text: title, style: { color: "#64748B" } } },
    legend: { show: false },
    grid: { borderColor: "#F1F5F9", strokeDashArray: 3 },
});

const buildDonutOptions = (labels) => ({
    chart: { type: "donut", fontFamily: "Outfit, sans-serif" },
    labels: labels,
    plotOptions: { pie: { donut: { size: "65%" } } },
    dataLabels: { enabled: true, formatter: (val) => `${Math.round(val)}%` },
    legend: { position: "bottom" },
});

const buildHorizontalBarOptions = (labels, colors) => ({
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: colors,
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "60%" } },
    dataLabels: { enabled: true, style: { colors: ["#fff"] } },
    xaxis: { categories: labels },
    grid: { borderColor: "#F1F5F9", strokeDashArray: 3 },
    tooltip: { theme: "light" },
});

// ─── Helper Functions ───────────────────────────────────────────────
const computeJenjang = (data) => {
    const counts = {};
    data.forEach(p => {
        const j = p.jenjang_sekolah?.toUpperCase().trim() || "LAINNYA";
        counts[j] = (counts[j] || 0) + 1;
    });
    const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const series = labels.map(l => counts[l]);
    const colors = labels.map(l => JENJANG_COLORS[l] || DEFAULT_COLOR);
    return { labels, series, colors };
};

const computeKesediaan = (data) => {
    const counts = {};
    data.forEach(p => {
        const k = p.status_kesediaan?.toUpperCase().trim() || "TIDAK DIKETAHUI";
        counts[k] = (counts[k] || 0) + 1;
    });
    const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return { labels, series: labels.map(l => counts[l]) };
};

const computeLptk = (data) => {
    const counts = {};
    data.forEach(p => {
        const l = p.lptk?.toUpperCase().trim() || "TIDAK DIKETAHUI";
        counts[l] = (counts[l] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
    return { labels: sorted.map(x => x[0]), series: sorted.map(x => x[1]) };
};

const computeBidangStudi = (data) => {
    const counts = {};
    data.forEach(p => {
        const b = p.bidang_studi_ppg?.toUpperCase().trim() || "TIDAK DIKETAHUI";
        counts[b] = (counts[b] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
    return { labels: sorted.map(x => x[0]), series: sorted.map(x => x[1]) };
};

// ─── Component Start ────────────────────────────────────────────────
const PpgCharts = ({ isLoading, hasData, ppgStatistik = [] }) => {
    const [selectedTahap, setSelectedTahap] = useState("");
    const [selectedKabupaten, setSelectedKabupaten] = useState("");
    const [selectedTahun, setSelectedTahun] = useState("");

    const tahapList = useMemo(() => {
        if (!ppgStatistik.length) return [];
        const set = new Set();
        ppgStatistik.forEach(p => {
            if (p.tahap?.trim()) set.add(p.tahap.trim());
        });
        return Array.from(set).sort();
    }, [ppgStatistik]);

    const kabupatenList = useMemo(() => {
        if (!ppgStatistik.length) return [];
        const set = new Set();
        ppgStatistik.forEach(p => {
            if (p.kota_kab_sekolah?.trim()) set.add(p.kota_kab_sekolah.trim());
        });
        return Array.from(set).sort();
    }, [ppgStatistik]);

    const tahunList = useMemo(() => {
        if (!ppgStatistik.length) return [];
        const set = new Set();
        ppgStatistik.forEach(p => {
            if (p.tahun?.toString().trim()) set.add(p.tahun.toString().trim());
        });
        return Array.from(set).sort((a, b) => b.localeCompare(a));
    }, [ppgStatistik]);

    const filteredData = useMemo(() => {
        return ppgStatistik.filter(p => {
            const matchTahap = selectedTahap ? p.tahap?.trim() === selectedTahap : true;
            const matchKab = selectedKabupaten ? p.kota_kab_sekolah?.trim() === selectedKabupaten : true;
            const matchTahun = selectedTahun ? p.tahun?.toString().trim() === selectedTahun : true;
            return matchTahap && matchKab && matchTahun;
        });
    }, [ppgStatistik, selectedTahap, selectedKabupaten, selectedTahun]);

    const jenjangData = useMemo(() => computeJenjang(filteredData), [filteredData]);
    const kesediaanData = useMemo(() => computeKesediaan(filteredData), [filteredData]);
    const lptkData = useMemo(() => computeLptk(filteredData), [filteredData]);
    const bidangStudiData = useMemo(() => computeBidangStudi(filteredData), [filteredData]);

    if (isLoading) return <Loading />;
    if (!hasData) return <NoData message="Data PPG Kosong" />;

    return (
        <Grid container spacing={4}>
            {/* ── Filter Section (Full Width) ────────────────────────── */}
            <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#F8FAFC", display: "flex", alignItems: "center", gap: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} color="#475569">
                        <FilterAltIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>Filter</Typography>
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 200, bgcolor: "white" }}>
                        <InputLabel>Tahap</InputLabel>
                        <Select
                            value={selectedTahap}
                            label="Tahap"
                            onChange={(e) => setSelectedTahap(e.target.value)}
                        >
                            <MenuItem value=""><em>Semua Tahap</em></MenuItem>
                            {tahapList.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 220, bgcolor: "white" }}>
                        <InputLabel>Kabupaten / Kota</InputLabel>
                        <Select
                            value={selectedKabupaten}
                            label="Kabupaten / Kota"
                            onChange={(e) => setSelectedKabupaten(e.target.value)}
                        >
                            <MenuItem value=""><em>Semua Kabupaten</em></MenuItem>
                            {kabupatenList.map(kab => <MenuItem key={kab} value={kab}>{kab}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150, bgcolor: "white" }}>
                        <InputLabel>Tahun</InputLabel>
                        <Select
                            value={selectedTahun}
                            label="Tahun"
                            onChange={(e) => setSelectedTahun(e.target.value)}
                        >
                            <MenuItem value=""><em>Semua Tahun</em></MenuItem>
                            {tahunList.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Paper>
            </Grid>

            {/* ── Baris 1: Jenjang Sekolah (Full Width) ─────────────── */}
            <ChartCard title="Sebaran Jenjang Sekolah (PPG)" subtitle={`Total: ${filteredData.length} Guru`} xs={12}>
                <ResizableChart
                    options={buildBarOptions(jenjangData.labels, jenjangData.colors, "Jumlah Guru")}
                    series={[{ name: "Jumlah", data: jenjangData.series }]}
                    type="bar"
                    height={350}
                />
            </ChartCard>

            {/* ── Baris 2: Status Kesediaan (Full Width) ─────────────── */}
            <ChartCard title="Status Kesediaan" subtitle="Proporsi Kesediaan Guru" xs={12}>
                <ResizableChart
                    options={buildDonutOptions(kesediaanData.labels)}
                    series={kesediaanData.series}
                    type="donut"
                    height={350}
                />
            </ChartCard>

            {/* ── Baris 3: Sebaran LPTK (Full Width) ─────────────────── */}
            <ChartCard title="Sebaran LPTK (Top 15)" subtitle="LPTK Terbanyak" xs={12}>
                {lptkData.labels.length > 0 ? (
                    <ResizableChart
                        options={buildHorizontalBarOptions(lptkData.labels, ["#8B5CF6"])}
                        series={[{ name: "Jumlah", data: lptkData.series }]}
                        type="bar"
                        height={350}
                    />
                ) : <NoData message="Tidak ada data LPTK" />}
            </ChartCard>

            {/* ── Baris 4: Bidang Studi (Full Width) ────────────────── */}
            <ChartCard title="Bidang Studi PPG (Top 15)" subtitle="Bidang Studi terbanyak diambil oleh Guru" xs={12}>
                {bidangStudiData.labels.length > 0 ? (
                    <ResizableChart
                        options={buildHorizontalBarOptions(bidangStudiData.labels, ["#10B981"])}
                        series={[{ name: "Jumlah", data: bidangStudiData.series }]}
                        type="bar"
                        height={450}
                    />
                ) : <NoData message="Tidak ada data Bidang Studi" />}
            </ChartCard>
        </Grid>
    );
};

export default PpgCharts;