import React, { useState, useMemo } from "react";
import {
    Grid, Typography, Box, FormControl, InputLabel,
    Select, MenuItem, Chip, Paper
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ResizableChart, ChartCard, Loading, NoData } from "@/pages/DataPage/Statistik/components/SharedComponents";

// ─── color constants ─────────────────────────────────────────────────────────
const NEGERI_COLOR = "#1D4ED8";
const SWASTA_COLOR = "#F97316";

const JENJANG_ORDER = ["PAUD", "PKBM", "SD", "SKB", "SLB", "SMA", "SMK", "SMP"];
const JENJANG_COLORS = {
    PAUD: "#F87171",
    PKBM: "#D97706",
    SD: "#65A30D",
    SKB: "#059669",
    SLB: "#06B6D4",
    SMA: "#3B82F6",
    SMK: "#A78BFA",
    SMP: "#EC4899",
};
const KABUPATEN_COLORS = [
    "#10B981", "#22C55E", "#F87171", "#84CC16", "#3B82F6",
    "#D97706", "#EC4899", "#06B6D4", "#A78BFA", "#F59E0B",
];

// ─── chart option builders ────────────────────────────────────────────────────
const buildJenjangOptions = (labels, colors) => ({
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: ["#3B82F6"], // Unified solid color (blue) matches the other bar charts
    plotOptions: {
        bar: { distributed: false, borderRadius: 0, columnWidth: "50%", dataLabels: { position: "top" } },
    },
    dataLabels: {
        enabled: true,
        style: { fontSize: "12px", fontWeight: 700, colors: ["#1E293B"] },
        offsetY: -20,
        background: { enabled: false },
        formatter: (val) => val > 0 ? val.toLocaleString() : "",
    },
    xaxis: {
        categories: labels,
        labels: { style: { colors: "#64748B", fontSize: "11px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
        title: { text: "Jenjang", style: { color: "#64748B", fontSize: "12px" } },
    },
    yaxis: {
        title: { text: "Jumlah Unit", style: { color: "#64748B", fontSize: "12px" } },
        labels: { style: { colors: "#64748B" } },
    },
    legend: { show: false },
    grid: { borderColor: "#F1F5F9", strokeDashArray: 3, padding: { top: 20 } },
    tooltip: { theme: "light", y: { formatter: (v) => `${v.toLocaleString()} Sekolah` } },
});

const buildKabupatenStatusOptions = (kabupaten) => ({
    chart: { type: "bar", stacked: true, toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: [SWASTA_COLOR, NEGERI_COLOR],
    plotOptions: { bar: { horizontal: true, barHeight: "65%" } },
    dataLabels: {
        enabled: true,
        style: { fontSize: "11px", fontWeight: 600, colors: ["#fff"] },
        formatter: (val) => (val > 0 ? val.toLocaleString() : ""),
    },
    xaxis: {
        categories: kabupaten,
        title: { text: "Jumlah Sekolah", style: { color: "#64748B", fontSize: "12px" } },
        labels: { style: { colors: "#64748B" } },
    },
    yaxis: { labels: { style: { colors: "#374151", fontSize: "12px" } } },
    legend: {
        position: "bottom", markers: { radius: 3 }, labels: { colors: "#374151" },
        customLegendItems: ["Swasta", "Negeri"],
    },
    grid: { borderColor: "#F1F5F9", strokeDashArray: 3 },
    tooltip: { theme: "light", y: { formatter: (v) => `${v.toLocaleString()} Sekolah` } },
});

const buildProporsiJenjangOptions = (jenjang) => ({
    chart: { type: "bar", stacked: true, stackType: "100%", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors: [SWASTA_COLOR, NEGERI_COLOR],
    plotOptions: { bar: { columnWidth: "65%", dataLabels: { position: "center" } } },
    dataLabels: {
        enabled: true,
        style: { fontSize: "11px", fontWeight: 700, colors: ["#fff"] },
        // Hanya tampilkan jika segmen cukup besar (>= 8%), format: jumlah\n(persen%)
        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
            if (val < 8) return ""; // sembunyikan label di segmen terlalu tipis
            const count = w.config.series[seriesIndex].data[dataPointIndex];
            if (!count || count === 0) return "";
            return `${count.toLocaleString()} (${Math.round(val)}%)`;
        },
        dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.4 },
    },
    xaxis: {
        categories: jenjang,
        title: { text: "Jenjang Pendidikan", style: { color: "#64748B" } },
        labels: { style: { colors: "#64748B" } },
        axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
        title: { text: "Persentase (%)", style: { color: "#64748B" } },
        labels: { formatter: (v) => `${v}%`, style: { colors: "#64748B" } },
        max: 100,
    },
    legend: {
        position: "bottom", markers: { radius: 3 }, labels: { colors: "#374151" },
        customLegendItems: ["Swasta", "Negeri"],
    },
    grid: { borderColor: "#F1F5F9", strokeDashArray: 3 },
    tooltip: {
        theme: "light",
        y: {
            formatter: (v, { seriesIndex, dataPointIndex, w }) => {
                const count = w.config.series[seriesIndex].data[dataPointIndex];
                return `${count?.toLocaleString() || 0} Sekolah (${Math.round(v)}%)`;
            },
        },
    },
});

const buildKabupatenTotalOptions = (labels, colors, total) => ({
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Outfit, sans-serif" },
    colors,
    plotOptions: {
        bar: {
            horizontal: true,
            distributed: true,
            barHeight: "65%",
            // Label di DALAM bar, rata kiri — warna putih kontras
            dataLabels: { position: "center" },
        },
    },
    dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: { fontSize: "11px", fontWeight: 700, colors: ["#fff"] },
        offsetX: 8,
        dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.35 },
        formatter: (val) => val > 0 ? val.toLocaleString() : "",
    },
    xaxis: {
        categories: labels,
        title: { text: "Jumlah Unit Sekolah", style: { color: "#64748B", fontSize: "12px" } },
        labels: { style: { colors: "#64748B" } },
    },
    yaxis: { labels: { style: { colors: "#374151", fontSize: "12px" } } },
    legend: { show: false },
    grid: { borderColor: "#F1F5F9", strokeDashArray: 3, padding: { right: 10 } },
    tooltip: { theme: "light", y: { formatter: (v) => `${v.toLocaleString()} Sekolah` } },
    subtitle: {
        text: `Total: ${total.toLocaleString()} Sekolah`,
        align: "center",
        style: { fontSize: "12px", color: "#64748B" },
    },
});

const buildDonutOptions = (total) => ({
    chart: { type: "donut", fontFamily: "Outfit, sans-serif", toolbar: { show: false } },
    colors: [NEGERI_COLOR, SWASTA_COLOR],
    labels: ["Negeri", "Swasta"],
    plotOptions: {
        pie: {
            expandOnClick: false,
            donut: {
                size: "62%",
                labels: {
                    show: true,
                    name: { show: true, fontSize: "14px", color: "#64748B", offsetY: -8 },
                    value: {
                        show: true, fontSize: "22px", fontWeight: 700,
                        color: "#1C2434", offsetY: 8,
                        formatter: (val) => Number(val).toLocaleString(),
                    },
                    total: {
                        show: true,
                        showAlways: false,
                        label: "Total Sekolah",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#64748B",
                        formatter: () => total.toLocaleString(),
                    },
                },
            },
        },
    },
    dataLabels: {
        enabled: true,
        // Hanya tampilkan persentase — jumlah sudah ada di hover tooltip & dalam ring
        formatter: (val) => `${Math.round(val)}%`,
        style: { fontSize: "14px", fontWeight: 700, colors: ["#fff"] },
        dropShadow: { enabled: true, top: 1, left: 1, blur: 3, opacity: 0.45 },
    },
    legend: {
        position: "bottom", markers: { radius: 3 }, labels: { colors: "#374151" },
        fontSize: "13px", itemMargin: { horizontal: 16 },
        formatter: (name, opts) => {
            const count = opts.w.globals.series[opts.seriesIndex];
            return `${name}: ${count.toLocaleString()}`;
        },
    },
    stroke: { width: 3, colors: ["#fff"] },
    tooltip: { theme: "light", y: { formatter: (v) => `${v.toLocaleString()} Sekolah` } },
    subtitle: {
        text: `Analisis berdasarkan ${total.toLocaleString()} Unit Sekolah`,
        align: "center",
        style: { fontSize: "12px", color: "#64748B" },
    },
});

// ─── helpers ──────────────────────────────────────────────────────────────────
const computeJenjangDistribusi = (data) => {
    const counts = {};
    data.forEach((s) => {
        const j = s.jenjang?.toUpperCase().trim() || "LAINNYA";
        counts[j] = (counts[j] || 0) + 1;
    });
    const labels = [], countArr = [], colors = [];
    JENJANG_ORDER.forEach((j) => {
        if (counts[j] !== undefined) {
            labels.push(j);
            countArr.push(counts[j]);
            colors.push(JENJANG_COLORS[j] || "#94A3B8");
        }
    });
    Object.keys(counts).forEach((j) => {
        if (!JENJANG_ORDER.includes(j)) {
            labels.push(j);
            countArr.push(counts[j]);
            colors.push("#94A3B8");
        }
    });
    return { labels, counts: countArr, colors };
};

const computeJenjangProportion = (data) => {
    const map = {};
    data.forEach((s) => {
        const j = s.jenjang?.toUpperCase().trim() || "LAINNYA";
        const status = s.status_sekolah?.toLowerCase();
        if (!map[j]) map[j] = { negeri: 0, swasta: 0 };
        if (status === "negeri") map[j].negeri++;
        else if (status === "swasta") map[j].swasta++;
    });
    const jenjangLabels = JENJANG_ORDER.filter((j) => map[j] !== undefined);
    return {
        jenjang: jenjangLabels,
        negeri: jenjangLabels.map((j) => map[j].negeri),
        swasta: jenjangLabels.map((j) => map[j].swasta),
    };
};

const computeStatusSummary = (data) => {
    let negeri = 0, swasta = 0;
    data.forEach((s) => {
        const st = s.status_sekolah?.toLowerCase();
        if (st === "negeri") negeri++;
        else if (st === "swasta") swasta++;
    });
    return { negeri, swasta };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SekolahCharts = ({
    isLoading,
    hasData,
    sekolahStatistik = [],
    kabupatenStatusData,
    kabupatenTotalData,
}) => {
    const [selectedKabupaten, setSelectedKabupaten] = useState("");

    // Build unique kabupaten list for dropdown
    const kabupatenList = useMemo(() => {
        if (!sekolahStatistik.length) return [];
        const set = new Set();
        sekolahStatistik.forEach((s) => {
            if (s.kabupaten?.trim()) set.add(s.kabupaten.trim());
        });
        return Array.from(set).sort();
    }, [sekolahStatistik]);

    // Filter raw data based on selection
    const filteredData = useMemo(() => {
        if (!selectedKabupaten) return sekolahStatistik;
        return sekolahStatistik.filter((s) => s.kabupaten?.trim() === selectedKabupaten);
    }, [sekolahStatistik, selectedKabupaten]);

    // Recompute the 3 filtered charts
    const jenjangDistribusiData = useMemo(() => computeJenjangDistribusi(filteredData), [filteredData]);
    const jenjangStatusProportionData = useMemo(() => computeJenjangProportion(filteredData), [filteredData]);
    const statusSummary = useMemo(() => computeStatusSummary(filteredData), [filteredData]);
    const donutSeries = [statusSummary.negeri, statusSummary.swasta];
    const donutTotal = statusSummary.negeri + statusSummary.swasta;

    // Static chart options (memoised)
    const jenjangOpts = useMemo(
        () => buildJenjangOptions(jenjangDistribusiData.labels, jenjangDistribusiData.colors),
        [jenjangDistribusiData]
    );
    const proporsiOpts = useMemo(
        () => buildProporsiJenjangOptions(jenjangStatusProportionData.jenjang),
        [jenjangStatusProportionData.jenjang]
    );
    const donutOpts = useMemo(() => buildDonutOptions(donutTotal), [donutTotal]);

    const kabStatusOpts = useMemo(
        () => buildKabupatenStatusOptions(kabupatenStatusData.kabupaten),
        [kabupatenStatusData.kabupaten]
    );
    const kabTotalOpts = useMemo(() => {
        const total = kabupatenTotalData.data.reduce((a, b) => a + b, 0);
        return buildKabupatenTotalOptions(kabupatenTotalData.labels, kabupatenTotalData.colors, total);
    }, [kabupatenTotalData]);

    if (isLoading) return <Loading />;
    if (!hasData) return <NoData message="Data Sekolah Kosong" />;

    return (
        <Grid container spacing={4}>

            {/* ── Filter Banner ─────────────────────────────────────────── */}
            <Grid size={{ xs: 12 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        bgcolor: "#F8FAFC",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1} color="#475569">
                        <FilterAltIcon fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>
                            Filter
                        </Typography>
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
                        <Chip
                            label={selectedKabupaten}
                            onDelete={() => setSelectedKabupaten("")}
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    )}

                    {selectedKabupaten && (
                        <Typography variant="caption" color="text.secondary" ml="auto">
                            Menampilkan {donutTotal.toLocaleString()} sekolah di {selectedKabupaten}
                        </Typography>
                    )}
                </Paper>
            </Grid>

            {/* ── Chart 5: Proporsi Negeri vs Swasta Donut ─────────────── */}
            <ChartCard title="Proporsi Sekolah Negeri vs Swasta" xs={12} md={5}>
                <ResizableChart
                    options={donutOpts}
                    series={donutSeries}
                    type="donut"
                    height={420}
                />
            </ChartCard>

            {/* ── Spacer so donut + kabupaten total sit side by side ────── */}
            <ChartCard title="Jumlah Sekolah Berdasarkan Kabupaten" xs={12} md={7}>
                <ResizableChart
                    options={kabTotalOpts}
                    series={[{ name: "Jumlah", data: kabupatenTotalData.data }]}
                    type="bar"
                    height={Math.max(400, kabupatenTotalData.labels.length * 48 + 100)}
                />
            </ChartCard>

            {/* ── Chart 1: Sebaran Sekolah Berdasarkan Jenjang ─────────── */}
            <ChartCard title="Sebaran Sekolah Berdasarkan Jenjang" xs={12}>
                <ResizableChart
                    options={jenjangOpts}
                    series={[{ name: "Jumlah Unit", data: jenjangDistribusiData.counts }]}
                    type="bar"
                    height={420}
                />
            </ChartCard>

            {/* ── Chart 3: Proporsi Negeri vs Swasta per Jenjang ───────── */}
            <ChartCard title="Proporsi Peran Negeri vs Swasta per Jenjang" xs={12}>
                <Box width="100%">
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Distribusi jumlah dan persentase sekolah berdasarkan status pengelolaan
                    </Typography>
                    <ResizableChart
                        options={proporsiOpts}
                        series={[
                            { name: "Swasta", data: jenjangStatusProportionData.swasta },
                            { name: "Negeri", data: jenjangStatusProportionData.negeri },
                        ]}
                        type="bar"
                        height={420}
                    />
                </Box>
            </ChartCard>

            {/* ── Chart 2: Komposisi Negeri & Swasta per Kabupaten ─────── */}
            <ChartCard title="Komposisi Sekolah Negeri & Swasta per Kabupaten" xs={12}>
                <Box width="100%">
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        Distribusi jumlah sekolah berdasarkan status (tidak terfilter kabupaten)
                    </Typography>
                    <ResizableChart
                        options={kabStatusOpts}
                        series={[
                            { name: "Swasta", data: kabupatenStatusData.swasta },
                            { name: "Negeri", data: kabupatenStatusData.negeri },
                        ]}
                        type="bar"
                        height={Math.max(400, kabupatenStatusData.kabupaten.length * 48 + 100)}
                    />
                </Box>
            </ChartCard>

        </Grid>
    );
};

export default SekolahCharts;
