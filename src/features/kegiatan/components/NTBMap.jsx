import React, { useState, useMemo } from "react";
import {
    Box, Typography, FormControl, InputLabel, Select,
    MenuItem, Chip, Divider,
} from "@mui/material";
import { ComposableMap, Geographies, Geography, Marker, Annotation } from "react-simple-maps";

const GEO_URL = "/nusa_tenggara_barat_52_batas_kabkota.geojson";

// Geographic centroids [lng, lat] for each kabupaten label
// All regions: label directly at centroid with Marker
const REGION_LABELS = [
    { name: "Kabupaten Lombok Barat", coords: [116.08, -8.72], short: "Lombok Barat" },
    { name: "Kabupaten Lombok Utara", coords: [116.30, -8.38], short: "Lombok Utara" },
    { name: "Kabupaten Lombok Tengah", coords: [116.32, -8.82], short: "Lombok Tengah" },
    { name: "Kabupaten Lombok Timur", coords: [116.58, -8.65], short: "Lombok Timur" },
    { name: "Kabupaten Sumbawa Barat", coords: [116.87, -8.75], short: "Sumbawa Barat" },
    { name: "Kabupaten Sumbawa", coords: [117.45, -8.75], short: "Sumbawa" },
    { name: "Kabupaten Dompu", coords: [118.35, -8.55], short: "Dompu" },
    { name: "Kabupaten Bima", coords: [118.72, -8.60], short: "Kab. Bima" },
    { name: "Kota Mataram", coords: [116.12, -8.58], short: "Mataram" },
    { name: "Kota Bima", coords: [118.72, -8.46], short: "Kota Bima" },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const JENJANG_ORDER = ["PAUD", "PNF", "SD", "SLB", "SMA", "SMK", "SMP"];
const JENJANG_COLORS = {
    PAUD: "#06B6D4", PNF: "#EAB308", SD: "#8B5CF6",
    SLB: "#EF4444", SMA: "#3B82F6", SMK: "#F97316", SMP: "#22C55E",
};

// Unique color per kabupaten/kota — adjacent regions use maximally different hues
// Lombok: LoBar↔Mataram(enclave), LoBar↔LoUt, LoBar↔LoTeng, LoUt↔LoTeng↔LoTim
// Sumbawa chain: SumBar→Sum→Dompu→KabBima→KotaBima(enclave)
const REGION_COLORS = {
    "Kabupaten Lombok Barat": "#D97706",  // Amber
    "Kota Mataram": "#9333EA",  // Purple  (enclave – max contrast with Amber)
    "Kabupaten Lombok Utara": "#BE185D",  // Pink    (adj: Amber, Purple)
    "Kabupaten Lombok Tengah": "#2563EB",  // Blue    (adj: Amber, Pink)
    "Kabupaten Lombok Timur": "#059669",  // Emerald (adj: Pink, Blue)
    "Kabupaten Sumbawa Barat": "#7C3AED",  // Violet
    "Kabupaten Sumbawa": "#EA580C",  // Orange  (adj: Violet)
    "Kabupaten Dompu": "#0891B2",  // Cyan    (adj: Orange)
    "Kabupaten Bima": "#CA8A04",  // Yellow  (adj: Cyan)
    "Kota Bima": "#0D9488",  // Teal    (enclave – max contrast with Yellow)
};

// Short display names
const SHORT_NAMES = {
    "Kabupaten Bima": "Kab. Bima",
    "Kabupaten Dompu": "Dompu",
    "Kabupaten Lombok Barat": "Lombok Barat",
    "Kabupaten Lombok Tengah": "Lombok Tengah",
    "Kabupaten Lombok Timur": "Lombok Timur",
    "Kabupaten Lombok Utara": "Lombok Utara",
    "Kabupaten Sumbawa": "Sumbawa",
    "Kabupaten Sumbawa Barat": "Sumbawa Barat",
    "Kota Bima": "Kota Bima",
    "Kota Mataram": "Mataram",
};

// peserta.kabupaten (raw) → GeoJSON name
const ALIASES = {
    "KABUPATEN BIMA": "Kabupaten Bima",
    "KAB. BIMA": "Kabupaten Bima",
    "KAB BIMA": "Kabupaten Bima",
    "BIMA": "Kabupaten Bima",
    "DOMPU": "Kabupaten Dompu",
    "KAB. DOMPU": "Kabupaten Dompu",
    "LOMBOK BARAT": "Kabupaten Lombok Barat",
    "KAB. LOMBOK BARAT": "Kabupaten Lombok Barat",
    "LOBAR": "Kabupaten Lombok Barat",
    "LOMBOK TENGAH": "Kabupaten Lombok Tengah",
    "KAB. LOMBOK TENGAH": "Kabupaten Lombok Tengah",
    "LOTENG": "Kabupaten Lombok Tengah",
    "LOMBOK TIMUR": "Kabupaten Lombok Timur",
    "KAB. LOMBOK TIMUR": "Kabupaten Lombok Timur",
    "LOTIM": "Kabupaten Lombok Timur",
    "LOMBOK UTARA": "Kabupaten Lombok Utara",
    "KAB. LOMBOK UTARA": "Kabupaten Lombok Utara",
    "SUMBAWA": "Kabupaten Sumbawa",
    "KAB. SUMBAWA": "Kabupaten Sumbawa",
    "SUMBAWA BARAT": "Kabupaten Sumbawa Barat",
    "KAB. SUMBAWA BARAT": "Kabupaten Sumbawa Barat",
    "KSB": "Kabupaten Sumbawa Barat",
    "KOTA BIMA": "Kota Bima",
    "KOTA MATARAM": "Kota Mataram",
    "MATARAM": "Kota Mataram",
};

const GEO_NAMES = Object.keys(REGION_COLORS);

const resolveGeoName = (rawKab) =>
    rawKab ? (ALIASES[(rawKab).toUpperCase().trim()] || null) : null;

// ─── Fill logic ───────────────────────────────────────────────────────────────
// Base fill = unique region color. Dim if filter active and this region has 0 count.
const regionFill = (name, count, hasFilter) =>
    hasFilter && count === 0 ? "#E2E8F0" : (REGION_COLORS[name] || "#94A3B8");

const regionHover = (name, count, hasFilter) =>
    hasFilter && count === 0 ? "#CBD5E1" : (REGION_COLORS[name] || "#94A3B8");

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const TooltipContent = ({ info }) => {
    if (!info) return null;
    const total = Object.values(info.jenjangMap).reduce((s, v) => s + v, 0);
    const sorted = Object.entries(info.jenjangMap)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1]);

    return (
        <Box sx={{
            position: "absolute",
            top: Math.max(4, info.y - 10),
            left: info.x + 16,
            bgcolor: "#1E293B", color: "#fff",
            px: 2, py: 1.5, borderRadius: 2,
            pointerEvents: "none", zIndex: 20, minWidth: 190,
            boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.08)",
        }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: REGION_COLORS[info.geoName] || "#94A3B8", flexShrink: 0 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{info.shortName}</Typography>
            </Box>
            <Typography sx={{ fontSize: 11, color: "#94A3B8", mb: 1 }}>
                Total: <strong style={{ color: "#fff" }}>{total.toLocaleString()} peserta</strong>
            </Typography>

            {sorted.length > 0 && (
                <>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />
                    {sorted.map(([jenjang, count]) => {
                        const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                        const barW = total > 0 ? (count / total) * 100 : 0;
                        const color = JENJANG_COLORS[jenjang] || "#94A3B8";
                        return (
                            <Box key={jenjang} sx={{ mb: 0.6 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.2 }}>
                                    <Typography sx={{ fontSize: 10, color: "#CBD5E1" }}>{jenjang}</Typography>
                                    <Typography sx={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>
                                        {count} ({pct}%)
                                    </Typography>
                                </Box>
                                <Box sx={{ height: 4, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }}>
                                    <Box sx={{ height: 4, width: `${barW}%`, bgcolor: color, borderRadius: 1 }} />
                                </Box>
                            </Box>
                        );
                    })}
                </>
            )}
        </Box>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const NTBMap = ({ peserta }) => {
    const [selectedJenjang, setSelectedJenjang] = useState("");
    const [tooltip, setTooltip] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const jenjangList = useMemo(() => {
        const set = new Set();
        peserta.forEach((p) => { if (p.jenjang) set.add(p.jenjang.toUpperCase().trim()); });
        const ordered = JENJANG_ORDER.filter((j) => set.has(j));
        set.forEach((j) => { if (!JENJANG_ORDER.includes(j)) ordered.push(j); });
        return ordered;
    }, [peserta]);

    const { countMap, breakdownMap } = useMemo(() => {
        const cMap = Object.fromEntries(GEO_NAMES.map((k) => [k, 0]));
        const bMap = Object.fromEntries(GEO_NAMES.map((k) => [k, {}]));

        peserta.forEach((p) => {
            const geoName = resolveGeoName(p.kabupaten);
            if (!geoName) return;
            const jenjang = (p.jenjang || "Lainnya").toUpperCase().trim();

            bMap[geoName][jenjang] = (bMap[geoName][jenjang] || 0) + 1;
            if (!selectedJenjang || jenjang === selectedJenjang) {
                cMap[geoName] = (cMap[geoName] || 0) + 1;
            }
        });

        return { countMap: cMap, breakdownMap: bMap };
    }, [peserta, selectedJenjang]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <Box sx={{ width: "100%", position: "relative" }} onMouseMove={handleMouseMove}>

            {/* ── Jenjang Filter ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Filter Jenjang</InputLabel>
                    <Select
                        value={selectedJenjang}
                        label="Filter Jenjang"
                        onChange={(e) => setSelectedJenjang(e.target.value)}
                    >
                        <MenuItem value=""><em>Semua Jenjang</em></MenuItem>
                        {jenjangList.map((j) => (
                            <MenuItem key={j} value={j}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: JENJANG_COLORS[j] || "#94A3B8" }} />
                                    {j}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedJenjang && (
                    <Chip
                        label={selectedJenjang}
                        onDelete={() => setSelectedJenjang("")}
                        size="small"
                        sx={{
                            bgcolor: JENJANG_COLORS[selectedJenjang] || "#94A3B8", color: "#fff",
                            "& .MuiChip-deleteIcon": { color: "rgba(255,255,255,0.7)" },
                        }}
                    />
                )}

                <Typography variant="caption" color="text.secondary">
                    {selectedJenjang
                        ? `Wilayah aktif = memiliki peserta jenjang ${selectedJenjang}`
                        : "Hover wilayah untuk melihat distribusi jenjang"}
                </Typography>
            </Box>

            {/* ── Floating Tooltip ── */}
            <TooltipContent info={tooltip ? { ...tooltip, x: mousePos.x, y: mousePos.y } : null} />

            {/* ── Map ── */}
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ center: [117.5, -9.2], scale: 13000 }}
                style={{ width: "100%", height: "100%", display: "block" }}
                viewBox="0 0 800 340"
            >
                <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const name = geo.properties.name;
                            const count = countMap[name] || 0;
                            const hasFilter = !!selectedJenjang;
                            const fill = regionFill(name, count, hasFilter);
                            const hov = regionHover(name, count, hasFilter);
                            const opacity = hasFilter && count === 0 ? 0.25 : 1;

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={fill}
                                    stroke="#ffffff"
                                    strokeWidth={0.7}
                                    opacity={opacity}
                                    style={{
                                        default: { fill, outline: "none" },
                                        hover: { fill: hov, outline: "none", cursor: "pointer", opacity: 1 },
                                        pressed: { fill: hov, outline: "none" },
                                    }}
                                    onMouseEnter={() =>
                                        setTooltip({
                                            geoName: name,
                                            shortName: SHORT_NAMES[name] || name,
                                            jenjangMap: breakdownMap[name] || {},
                                        })
                                    }
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            );
                        })
                    }
                </Geographies>

                {/* ── Labels ── */}
                {REGION_LABELS.map((r) => (
                    <Marker key={r.name} coordinates={r.coords}>
                        <text
                            textAnchor="middle"
                            fontSize="7"
                            fontWeight="700"
                            fill="#fff"
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth="2"
                            paintOrder="stroke"
                            style={{ pointerEvents: "none", fontFamily: "Outfit, sans-serif" }}
                        >
                            {r.short}
                        </text>
                    </Marker>
                ))}

            </ComposableMap>

            {/* ── Legend ── */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5, justifyContent: "center" }}>
                {Object.entries(REGION_COLORS).map(([name, color]) => (
                    <Box key={name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                            {SHORT_NAMES[name] || name}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* ── Summary badges ── */}
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                {Object.entries(countMap)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => (
                        <Box key={name} sx={{
                            px: 1.5, py: 0.5,
                            bgcolor: REGION_COLORS[name] || "#F1F5F9",
                            borderRadius: 2,
                            opacity: selectedJenjang && count === 0 ? 0.3 : 1,
                        }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>
                                {SHORT_NAMES[name] || name}: <strong>{count > 0 ? count.toLocaleString() : "–"}</strong>
                            </Typography>
                        </Box>
                    ))}
            </Box>


        </Box>
    );
};

export default NTBMap;
