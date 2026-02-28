import { useMemo, useEffect } from "react";
import { useSekolahStore } from "../../../stores/useSekolahStore";
import { usePtkStore } from "../../../stores/usePtkStore";
import { usePpgStore } from "../../../stores/usePpgStore";
import { useShallow } from "zustand/react/shallow";

export const useStatistikData = (activeTab = 0) => {

    // --- STORE SELECTION ---
    const { sekolahStatistik, getStatistikSekolah, totalSekolahStatistik, isSekolahLoading } = useSekolahStore(
        useShallow((state) => ({
            sekolahStatistik: state.sekolahStatistik,
            getStatistikSekolah: state.getStatistikSekolah,
            totalSekolahStatistik: state.totalSekolahStatistik,
            isSekolahLoading: state.isStatistikLoading,
        }))
    );

    const { ptkStatistik, getStatistikPtk, totalPtkStatistik, isPtkLoading } = usePtkStore(
        useShallow((state) => ({
            ptkStatistik: state.ptkStatistik,
            getStatistikPtk: state.getStatistikPtk,
            totalPtkStatistik: state.totalPtkStatistik,
            isPtkLoading: state.isStatistikLoading,
        }))
    );

    const { ppgStatistik, getStatistikPpg, totalPpgStatistik, isPpgLoading } = usePpgStore(
        useShallow((state) => ({
            ppgStatistik: state.ppgStatistik,
            getStatistikPpg: state.getStatistikPpg,
            totalPpgStatistik: state.totalPpgStatistik,
            isPpgLoading: state.isStatistikLoading,
        }))
    );

    // --- DATA FETCHING ---
    useEffect(() => {
        if (!sekolahStatistik || sekolahStatistik.length === 0) {
            getStatistikSekolah();
        }
        if (activeTab === 1 && (!ptkStatistik || ptkStatistik.length === 0)) {
            getStatistikPtk();
        }
        if (activeTab === 2 && (!ppgStatistik || ppgStatistik.length === 0)) {
            getStatistikPpg();
        }
    }, [activeTab, sekolahStatistik, ptkStatistik, ppgStatistik, getStatistikSekolah, getStatistikPtk, getStatistikPpg]);


    // --- AGGREGATION LOGIC ---

    // 1. KPI Totals
    const totalSekolah = totalSekolahStatistik || sekolahStatistik?.length || 0;
    const totalPtk = totalPtkStatistik || ptkStatistik?.length || 0;

    // 2. Jenjang order & colors (matching image)
    const JENJANG_ORDER = ["PAUD", "PKBM", "SD", "SKB", "SLB", "SMA", "SMK", "SMP"];
    const JENJANG_COLORS = {
        PAUD: "#F87171",   // salmon/red
        PKBM: "#D97706",   // amber
        SD: "#65A30D",   // green
        SKB: "#059669",   // emerald
        SLB: "#06B6D4",   // cyan
        SMA: "#3B82F6",   // blue
        SMK: "#A78BFA",   // violet
        SMP: "#EC4899",   // pink
    };

    // 3. Chart 1: Sebaran Sekolah Berdasarkan Jenjang (vertical bar, distributed colors)
    const jenjangDistribusiData = useMemo(() => {
        if (!sekolahStatistik || sekolahStatistik.length === 0) return { labels: [], counts: [], colors: [] };

        const counts = {};
        sekolahStatistik.forEach((s) => {
            const j = s.jenjang?.toUpperCase().trim() || "LAINNYA";
            counts[j] = (counts[j] || 0) + 1;
        });

        // Use order from JENJANG_ORDER, include others that exist
        const labels = [];
        const countArr = [];
        const colors = [];

        JENJANG_ORDER.forEach((j) => {
            if (counts[j] !== undefined) {
                labels.push(j);
                countArr.push(counts[j]);
                colors.push(JENJANG_COLORS[j] || "#94A3B8");
            }
        });

        // Add any extra jenjang not in the predefined order
        Object.keys(counts).forEach((j) => {
            if (!JENJANG_ORDER.includes(j)) {
                labels.push(j);
                countArr.push(counts[j]);
                colors.push("#94A3B8");
            }
        });

        return { labels, counts: countArr, colors };
    }, [sekolahStatistik]);

    // 4. Chart 2 & 3: Per-kabupaten breakdown Negeri vs Swasta
    const kabupatenStatusData = useMemo(() => {
        if (!sekolahStatistik || sekolahStatistik.length === 0)
            return { kabupaten: [], negeri: [], swasta: [] };

        const map = {}; // { kabupaten: { negeri: n, swasta: n } }
        sekolahStatistik.forEach((s) => {
            const kab = s.kabupaten?.trim() || "Tidak Diketahui";
            const status = s.status_sekolah?.toLowerCase();
            if (!map[kab]) map[kab] = { negeri: 0, swasta: 0 };
            if (status === "negeri") map[kab].negeri++;
            else if (status === "swasta") map[kab].swasta++;
        });

        // Sort by total descending
        const sorted = Object.entries(map)
            .map(([kab, v]) => ({ kab, total: v.negeri + v.swasta, negeri: v.negeri, swasta: v.swasta }))
            .sort((a, b) => a.total - b.total); // ascending so largest is at top in horizontal chart

        return {
            kabupaten: sorted.map((x) => x.kab),
            negeri: sorted.map((x) => x.negeri),
            swasta: sorted.map((x) => x.swasta),
        };
    }, [sekolahStatistik]);

    // 5. Chart 3: Proporsi Negeri vs Swasta per Jenjang (100% stacked)
    const jenjangStatusProportionData = useMemo(() => {
        if (!sekolahStatistik || sekolahStatistik.length === 0)
            return { jenjang: [], negeri: [], swasta: [] };

        const map = {};
        sekolahStatistik.forEach((s) => {
            const j = s.jenjang?.toUpperCase().trim() || "LAINNYA";
            const status = s.status_sekolah?.toLowerCase();
            if (!map[j]) map[j] = { negeri: 0, swasta: 0 };
            if (status === "negeri") map[j].negeri++;
            else if (status === "swasta") map[j].swasta++;
        });

        const jenjangLabels = JENJANG_ORDER.filter((j) => map[j] !== undefined);
        const negeriCounts = jenjangLabels.map((j) => map[j].negeri);
        const swastaCounts = jenjangLabels.map((j) => map[j].swasta);
        const totalCounts = jenjangLabels.map((j) => map[j].negeri + map[j].swasta);

        return {
            jenjang: jenjangLabels,
            negeri: negeriCounts,
            swasta: swastaCounts,
            total: totalCounts,
        };
    }, [sekolahStatistik]);

    // 6. Chart 4: Jumlah Sekolah per Kabupaten (horizontal bar, distinct colors, sorted desc)
    const KABUPATEN_COLORS = [
        "#10B981", "#22C55E", "#F87171", "#84CC16", "#3B82F6",
        "#D97706", "#EC4899", "#06B6D4", "#A78BFA", "#F59E0B",
    ];
    const kabupatenTotalData = useMemo(() => {
        if (!sekolahStatistik || sekolahStatistik.length === 0) return { labels: [], data: [], colors: [] };

        const counts = {};
        sekolahStatistik.forEach((s) => {
            const kab = s.kabupaten?.trim() || "Tidak Diketahui";
            counts[kab] = (counts[kab] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]); // ascending (largest at top in horizontal)
        return {
            labels: sorted.map((x) => x[0]),
            data: sorted.map((x) => x[1]),
            colors: sorted.map((_, i) => KABUPATEN_COLORS[i % KABUPATEN_COLORS.length]),
        };
    }, [sekolahStatistik]);

    // 7. Chart 5: Proporsi Negeri vs Swasta (Donut)
    const statusSekolahCounts = useMemo(() => {
        if (!sekolahStatistik) return { negeri: 0, swasta: 0 };
        let n = 0, s = 0;
        sekolahStatistik.forEach(sc => {
            const st = sc.status_sekolah?.toLowerCase();
            if (st === 'negeri') n++;
            else if (st === 'swasta') s++;
        });
        return { negeri: n, swasta: s };
    }, [sekolahStatistik]);

    const statusSekolahAggregation = useMemo(() => {
        return { labels: ["Negeri", "Swasta"], series: [statusSekolahCounts.negeri, statusSekolahCounts.swasta] };
    }, [statusSekolahCounts]);

    // 8. Akreditasi (kept for potential use)
    const akreditasiAggregation = useMemo(() => {
        if (!sekolahStatistik) return { labels: [], data: [] };
        const counts = {};
        sekolahStatistik.forEach(s => {
            const akrRaw = s.akreditasi?.trim().toUpperCase();
            if (["1", "30 MB", "TIDAK ADA", "TIDAK"].includes(akrRaw)) return;
            const akr = akrRaw || "BELUM";
            counts[akr] = (counts[akr] || 0) + 1;
        });
        const order = ["A", "B", "C", "TIDAK TERAKREDITASI", "BELUM"];
        const sortedKeys = Object.keys(counts).sort((a, b) => {
            const indexA = order.indexOf(a) !== -1 ? order.indexOf(a) : 99;
            const indexB = order.indexOf(b) !== -1 ? order.indexOf(b) : 99;
            return indexA - indexB;
        });
        return { labels: sortedKeys, data: sortedKeys.map(k => counts[k]) };
    }, [sekolahStatistik]);

    // --- PTK Aggregations ---

    // 9. PTK with Kabupaten (join with sekolah)
    const ptkStatistikWithKabupaten = useMemo(() => {
        if (!ptkStatistik || !sekolahStatistik) return [];

        const schoolMap = {};
        sekolahStatistik.forEach(s => {
            // Map by multiple potential keys to ensure a hit
            [s.sekolah_id, s.id_sekolah, s.id, s.npsn].forEach(key => {
                if (key) {
                    schoolMap[String(key).trim().toLowerCase()] = {
                        kabupaten: s.kabupaten,
                        akreditasi: s.akreditasi,
                        jenjang: s.jenjang,
                        status_sekolah: s.status_sekolah
                    };
                }
            });
        });

        return ptkStatistik.map(ptk => {
            let sm = null;
            // Try matching any of the PTK foreign keys against the schoolMap
            const foreignKeys = [ptk.sekolah_id, ptk.id_sekolah, ptk.npsn];
            for (let fk of foreignKeys) {
                if (fk) {
                    const mapped = schoolMap[String(fk).trim().toLowerCase()];
                    if (mapped) {
                        sm = mapped;
                        break;
                    }
                }
            }
            sm = sm || {};
            return {
                ...ptk,
                kabupaten: sm.kabupaten || "",
                akreditasi: sm.akreditasi || "",
                jenjang: sm.jenjang || "",
                status_sekolah: sm.status_sekolah || ""
            };
        });
    }, [ptkStatistik, sekolahStatistik]);

    // --- PPG Aggregations ---
    const totalPpg = totalPpgStatistik || ppgStatistik?.length || 0;

    const ppgJenjangData = useMemo(() => {
        if (!ppgStatistik || ppgStatistik.length === 0) return { labels: [], series: [] };
        const counts = {};
        ppgStatistik.forEach(p => {
            const j = p.jenjang_sekolah?.toUpperCase().trim() || "LAINNYA";
            counts[j] = (counts[j] || 0) + 1;
        });
        const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        return { labels, series: labels.map(l => counts[l]) };
    }, [ppgStatistik]);

    const ppgKesediaanData = useMemo(() => {
        if (!ppgStatistik || ppgStatistik.length === 0) return { labels: [], series: [] };
        const counts = {};
        ppgStatistik.forEach(p => {
            const k = p.status_kesediaan?.toUpperCase().trim() || "TIDAK DIKETAHUI";
            counts[k] = (counts[k] || 0) + 1;
        });
        const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        return { labels, series: labels.map(l => counts[l]) };
    }, [ppgStatistik]);

    const ppgLptkData = useMemo(() => {
        if (!ppgStatistik || ppgStatistik.length === 0) return { labels: [], series: [] };
        const counts = {};
        ppgStatistik.forEach(p => {
            const l = p.lptk?.toUpperCase().trim() || "TIDAK DIKETAHUI";
            counts[l] = (counts[l] || 0) + 1;
        });
        // Limit to top 15 LPTK
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
        return { labels: sorted.map(x => x[0]), series: sorted.map(x => x[1]) };
    }, [ppgStatistik]);

    const ppgBidangStudiData = useMemo(() => {
        if (!ppgStatistik || ppgStatistik.length === 0) return { labels: [], series: [] };
        const counts = {};
        ppgStatistik.forEach(p => {
            const b = p.bidang_studi_ppg?.toUpperCase().trim() || "TIDAK DIKETAHUI";
            counts[b] = (counts[b] || 0) + 1;
        });
        // Limit to top 15 bidang studi
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
        return { labels: sorted.map(x => x[0]), series: sorted.map(x => x[1]) };
    }, [ppgStatistik]);

    return {
        // Raw Data & Loading
        isSekolahLoading,
        isPtkLoading,
        isPpgLoading,
        sekolahStatistik,
        ptkStatistik,
        ppgStatistik,
        ptkStatistikWithKabupaten,

        // Aggregations - Sekolah
        totalSekolah,
        totalPtk,
        totalPpg,
        statusSekolahCounts,
        statusSekolahAggregation,
        akreditasiAggregation,

        // New chart aggregations
        jenjangDistribusiData,    // Chart 1: vertical bar by jenjang
        kabupatenStatusData,      // Chart 2: horizontal stacked bar kabupaten vs status
        jenjangStatusProportionData, // Chart 3: 100% stacked per jenjang
        kabupatenTotalData,       // Chart 4: horizontal bar by kabupaten (colored)

        // PPG
        ppgJenjangData,
        ppgKesediaanData,
        ppgLptkData,
        ppgBidangStudiData,
    };
};
