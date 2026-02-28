import React, { useState, useMemo } from "react";
import {
    Grid, Typography, Box, FormControl, InputLabel,
    Select, MenuItem, Chip, Paper
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ResizableChart, Loading, NoData } from "./SharedComponents";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const computeData = (data, key, options = {}) => {
    const { useThreshold = false, limit10 = false, excludeEmpty = false } = options;
    const counts = {};
    let total = 0;
    data.forEach(ptk => {
        let val = ptk[key]?.trim() || "Tidak Diisi";
        if (val !== '-' && (!excludeEmpty || (val !== "Tidak Diisi" && val !== ""))) {
            counts[val] = (counts[val] || 0) + 1;
            total++;
        }
    });

    let finalCounts = { ...counts };

    if (useThreshold && total > 0) {
        const threshold = total * 0.05;
        finalCounts = {};
        let lainnyaCount = 0;
        Object.keys(counts).forEach(k => {
            if (counts[k] <= threshold || k === "Lainnya" || k === "Lain-lain") {
                lainnyaCount += counts[k];
            } else {
                finalCounts[k] = counts[k];
            }
        });
        if (lainnyaCount > 0) finalCounts["Lainnya"] = lainnyaCount;
    }

    let sorted = Object.entries(finalCounts).sort((a, b) => b[1] - a[1]);
    if (limit10) sorted = sorted.slice(0, 10);

    return { labels: sorted.map(i => i[0]), series: sorted.map(i => i[1]) };
};

const computeStatusSekolah = (data) => {
    let n = 0, s = 0;
    data.forEach(ptk => {
        const val = ptk.status_sekolah?.toLowerCase();
        if (val === 'negeri') n++;
        else if (val === 'swasta') s++;
    });
    return { labels: ["Negeri", "Swasta"], series: [n, s] };
};

const computeGenderPtk = (data) => {
    let p = 0, l = 0;
    data.forEach(ptk => {
        const jk = ptk.jenis_kelamin?.toUpperCase().trim();
        if (jk === "L" || jk === "LAKI-LAKI") l++;
        else if (jk === "P" || jk === "PEREMPUAN") p++;
    });
    return { labels: ["P", "L"], series: [p, l] };
};

// ─── Custom Layout Components ─────────────────────────────────────────────────
const DashboardCard = ({ title, children, xs = 12, md }) => (
    <Grid size={{ xs, md: md || xs }}>
        <Box height="100%" display="flex" flexDirection="column" bgcolor="#fff" p={1}>
            {title && (
                <Typography variant="body1" color="#000" mb={1} sx={{ fontSize: '1.2rem', ml: 2, mt: 1 }}>
                    {title}
                </Typography>
            )}
            <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
                {children}
            </Box>
        </Box>
    </Grid>
);

// ─── Chart Options ────────────────────────────────────────────────────────────
const CHART_COLORS = [
    "#2563EB", "#3B82F6", "#60A5FA", "#0D9488", "#14B8A6",
    "#8B5CF6", "#A78BFA", "#F59E0B", "#FBBF24", "#EC4899"
];

const buildBlueBarOptions = (labels, xTitle) => ({
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: CHART_COLORS,
    plotOptions: {
        bar: {
            borderRadius: 4,
            columnWidth: "55%",
            distributed: true,
            dataLabels: { position: "top" }
        }
    },
    dataLabels: {
        enabled: true,
        offsetY: -22,
        style: { fontSize: "11px", colors: ["#334155"], fontWeight: 700 },
        formatter: (val) => val > 0 ? (val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val) : "0",
    },
    xaxis: {
        categories: labels,
        labels: {
            style: { colors: "#475569", fontSize: "11px", fontWeight: 500 },
            trim: true,
            maxHeight: 70
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        title: { text: xTitle, style: { fontWeight: 700, fontSize: "12px", color: "#1E293B" } }
    },
    yaxis: {
        title: { text: "Jumlah", style: { fontWeight: 700, fontSize: "12px", color: "#1E293B" } },
        labels: {
            style: { colors: "#64748B", fontWeight: 500 },
            formatter: (val) => val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val
        }
    },
    legend: { show: false }, // Hide legend for distributed colors
    grid: { strokeDashArray: 4, borderColor: "#E2E8F0", padding: { top: 20 } },
    tooltip: { theme: "light", y: { formatter: (val) => val.toLocaleString() } }
});

const buildPieOptions = (labels, colors) => ({
    chart: { type: "pie", fontFamily: "Outfit, sans-serif", toolbar: { show: false } },
    colors: colors,
    labels: labels,
    dataLabels: {
        enabled: true,
        formatter: (val, opts) => {
            const count = opts.w.globals.seriesTotals[opts.seriesIndex];
            const countStr = count >= 1000 ? (count / 1000).toFixed(0) + 'K' : count;
            return `${countStr}\n(${val.toFixed(2)}%)`;
        },
        style: { fontSize: "10px", colors: ["#616161"], fontWeight: 400 },
        background: { enabled: false, dropShadow: { enabled: false } },
        dropShadow: { enabled: false }
    },
    legend: {
        position: "right",
        formatter: (name) => name
    },
    stroke: { show: false },
    tooltip: { y: { formatter: (val) => val.toLocaleString() } }
});

const PtkCharts = ({
    isLoading,
    hasData,
    ptkStatistik = []
}) => {
    const [selectedKabupaten, setSelectedKabupaten] = useState("");

    const kabupatenList = useMemo(() => {
        if (!ptkStatistik.length) return [];
        const set = new Set();
        ptkStatistik.forEach((p) => {
            if (p.kabupaten?.trim() && p.kabupaten !== "Tidak Diketahui") set.add(p.kabupaten.trim());
        });
        return Array.from(set).sort();
    }, [ptkStatistik]);

    const filteredData = useMemo(() => {
        if (!selectedKabupaten) return ptkStatistik;
        return ptkStatistik.filter((p) => p.kabupaten?.trim() === selectedKabupaten);
    }, [ptkStatistik, selectedKabupaten]);

    // Data Aggregations
    const statusKepegData = useMemo(() => computeData(filteredData, 'status_kepegawaian', { useThreshold: true }), [filteredData]);
    const jenisPtkData = useMemo(() => computeData(filteredData, 'jenis_ptk', { useThreshold: true }), [filteredData]);
    const genderPtkData = useMemo(() => computeGenderPtk(filteredData), [filteredData]);

    // For School data attributes, exclude "Tidak Diisi" if the user complained about it
    const kabData = useMemo(() => computeData(filteredData, 'kabupaten', { useThreshold: false, excludeEmpty: true }), [filteredData]);
    const akredData = useMemo(() => computeData(filteredData, 'akreditasi', { useThreshold: false, excludeEmpty: true }), [filteredData]);
    const jabatanData = useMemo(() => computeData(filteredData, 'jabatan_ptk', { useThreshold: true }), [filteredData]);
    const jenjangData = useMemo(() => computeData(filteredData, 'jenjang', { useThreshold: false, excludeEmpty: true }), [filteredData]);
    const statusSekolahData = useMemo(() => computeStatusSekolah(filteredData), [filteredData]);

    const statusKepegOpts = useMemo(() => buildBlueBarOptions(statusKepegData.labels, "Status Kepegawaian"), [statusKepegData]);
    const jenisPtkOpts = useMemo(() => buildBlueBarOptions(jenisPtkData.labels, "Jenis PTK"), [jenisPtkData]);
    const kabOpts = useMemo(() => buildBlueBarOptions(kabData.labels, "Kabupaten Sekolah"), [kabData]);
    const akredOpts = useMemo(() => buildBlueBarOptions(akredData.labels, "Akreditasi Sekolah"), [akredData]);
    const jabatanOpts = useMemo(() => buildBlueBarOptions(jabatanData.labels, "Jabatan PTK"), [jabatanData]);
    const jenjangOpts = useMemo(() => buildBlueBarOptions(jenjangData.labels, "Jenjang Sekolah"), [jenjangData]);

    const genderOpts = useMemo(() => buildPieOptions(genderPtkData.labels, ["#1A237E", "#2196F3"]), [genderPtkData]); // P=Dark, L=Light
    const statusSekolahOpts = useMemo(() => buildPieOptions(statusSekolahData.labels, ["#2196F3", "#1A237E"]), [statusSekolahData]); // Negeri=Light, Swasta=Dark

    if (isLoading) return <Loading />;
    if (!hasData) return <NoData message="Data PTK Kosong" />;

    return (
        <Grid container spacing={2}>
            {/* ── Filter Banner ─────────────────────────────────────────── */}
            <Grid size={{ xs: 12 }} mb={2}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 2, borderRadius: "12px", border: "1px solid #E2E8F0",
                        bgcolor: "#F8FAFC", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1} color="#475569">
                        <FilterAltIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>
                            Filter                        </Typography>
                    </Box>
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel>Kabupaten / Kota</InputLabel>
                        <Select
                            value={selectedKabupaten}
                            label="Kabupaten / Kota"
                            onChange={(e) => setSelectedKabupaten(e.target.value)}
                        >
                            <MenuItem value=""><em>Semua Kabupaten</em></MenuItem>
                            {kabupatenList.map((kab) => (
                                <MenuItem key={kab} value={kab}>{kab}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedKabupaten && (
                        <Chip label={selectedKabupaten} onDelete={() => setSelectedKabupaten("")} color="primary" size="small" variant="outlined" />
                    )}
                </Paper>
            </Grid>

            {/* MAIN HEADER */}
            {/* <Grid size={{ xs: 12 }}>
                <Box bgcolor="#64B5F6" p={1.5} border="1px solid #42A5F5">
                    <Typography variant="h5" align="center" fontWeight="bold" color="#fff" sx={{ textTransform: 'uppercase' }}>
                        DASHBOARD DATA PTK BALAI GTK NUSA TENGGARA BARAT
                    </Typography>
                </Box>
            </Grid> */}

            {/* ROW 1 */}
            <DashboardCard xs={12} md={8}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Status Kepegawaian</Typography>
                    <ResizableChart options={statusKepegOpts} series={[{ name: 'Jumlah', data: statusKepegData.series }]} type="bar" height={300} />
                </Box>
            </DashboardCard>
            <DashboardCard xs={12} md={4}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                    <Typography variant="subtitle1" color="#000" mb={1}>Jumlah Data</Typography>
                    <Typography variant="caption" color="text.secondary" mb={1} sx={{ mt: -1 }}>Sum of angkatan_psp</Typography>
                    <Box bgcolor="#BBDEFB" px={4} py={1} borderRadius="4px">
                        <Typography variant="h3" color="#000">{filteredData.length}</Typography>
                    </Box>
                </Box>
            </DashboardCard>

            {/* ROW 2 */}
            <DashboardCard xs={12} md={8}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Jenis PTK</Typography>
                    <ResizableChart options={jenisPtkOpts} series={[{ name: 'Jumlah', data: jenisPtkData.series }]} type="bar" height={300} />
                </Box>
            </DashboardCard>
            <DashboardCard xs={12} md={4}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Jenis Kelamin</Typography>
                    <ResizableChart options={genderOpts} series={genderPtkData.series} type="pie" height={280} />
                </Box>
            </DashboardCard>

            {/* SUBHEADER 1 */}
            <Grid size={{ xs: 12 }} mt={2}>
                <Typography variant="h6" align="center" color="#000" sx={{ mb: 1 }}>
                    Sebaran Wilayah / Jumlah PTK Per Wilayah Berdasarkan Data Sekolah
                </Typography>
            </Grid>

            {/* ROW 3 & 4 */}
            <DashboardCard xs={12}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Jumlah Sekolah Berdasarkan Kab/Kota</Typography>
                    <ResizableChart options={kabOpts} series={[{ name: 'Jumlah', data: kabData.series }]} type="bar" height={300} />
                </Box>
            </DashboardCard>
            <DashboardCard xs={12}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Jumlah AKreditasi Sekolah</Typography>
                    <ResizableChart options={akredOpts} series={[{ name: 'Jumlah', data: akredData.series }]} type="bar" height={300} />
                </Box>
            </DashboardCard>

            {/* SUBHEADER 2 */}
            <Grid size={{ xs: 12 }} mt={2}>
                {/* No title here in original screenshot 3, it says 'Sebaran PTK di Sekolah' later. Wait, 'Jabatan PTK' is just under the main header. */}
                <Typography variant="h6" align="center" color="#000" sx={{ mb: 1, visibility: 'hidden' }}>
                    Divider
                </Typography>
            </Grid>

            {/* ROW 5 */}
            <DashboardCard xs={12}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Jabatan PTK</Typography>
                    <ResizableChart options={jabatanOpts} series={[{ name: 'Jumlah', data: jabatanData.series }]} type="bar" height={300} />
                </Box>
            </DashboardCard>

            {/* SUBHEADER 3 */}
            <Grid size={{ xs: 12 }}>
                <Typography variant="h6" align="center" color="#000" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Sebaran PTK di Sekolah
                </Typography>
            </Grid>

            {/* ROW 6 */}
            <DashboardCard xs={12} md={8}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Jumlah Jenjang Sekolah</Typography>
                    <ResizableChart options={jenjangOpts} series={[{ name: 'Jumlah', data: jenjangData.series }]} type="bar" height={300} />
                </Box>
            </DashboardCard>
            <DashboardCard xs={12} md={4}>
                <Box width="100%">
                    <Typography variant="body1" color="#000" ml={2} mt={1}>Status Sekolah</Typography>
                    <ResizableChart options={statusSekolahOpts} series={statusSekolahData.series} type="pie" height={280} />
                </Box>
            </DashboardCard>

        </Grid>
    );
};

export default PtkCharts;
