// Ppg.jsx
import { useMemo, useCallback, useEffect } from "react";
import DataTable from "../DataTable.jsx";
import { usePpgStore } from "../../../stores/usePpgStore.js";
import { useNotificationStore } from "../../../stores/useNotifStore";
import { Typography } from "@mui/material";
import { useShallow } from "zustand/react/shallow";

const Ppg = () => {
    const {
        isFetching,
        ppgData,
        isLoading,
        totalPages,
        currentPage,
        currentLimit,
        deletePpg,
        uploadPpg,
        getPpg,
        currentQuery,
        filters,
        setFilters,
        ppgStatistik,
        getStatistikPpg,
    } = usePpgStore(
        useShallow((state) => ({
            isFetching: state.isFetching,
            ppgData: state.ppgData,
            isLoading: state.isLoading,
            totalPages: state.totalPages,
            currentPage: state.currentPage,
            currentLimit: state.currentLimit,
            deletePpg: state.deletePpg,
            uploadPpg: state.uploadPpg,
            getPpg: state.getPpg,
            currentQuery: state.currentQuery,
            filters: state.filters,
            setFilters: state.setFilters,
            ppgStatistik: state.ppgStatistik,
            getStatistikPpg: state.getStatistikPpg,
        }))
    );

    const { showNotification } = useNotificationStore();

    // Unique kota/kab options for filter dropdown
    const kabupatenOptions = useMemo(() => {
        if (!ppgStatistik) return [];
        const unique = [
            ...new Set(ppgStatistik.map((p) => p.kota_kab_sekolah?.trim()).filter(Boolean)),
        ];
        return unique.sort();
    }, [ppgStatistik]);

    // Unique tahap options for filter dropdown
    const tahapOptions = useMemo(() => {
        if (!ppgStatistik) return [];
        const unique = [
            ...new Set(ppgStatistik.map((p) => p.tahap?.trim()).filter(Boolean)),
        ];
        return unique.sort();
    }, [ppgStatistik]);

    // Unique tahun options for filter dropdown
    const tahunOptions = useMemo(() => {
        if (!ppgStatistik) return [];
        const unique = [
            ...new Set(ppgStatistik.map((p) => p.tahun?.toString().trim()).filter(Boolean)),
        ];
        return unique.sort((a, b) => b.localeCompare(a));
    }, [ppgStatistik]);

    const handleFilterOpen = useCallback(() => {
        if (!ppgStatistik || ppgStatistik.length === 0) {
            getStatistikPpg();
        }
    }, [ppgStatistik, getStatistikPpg]);

    const columns = useMemo(
        () => [
            {
                header: "NO",
                accessor: "no",
                render: (row, index) => (
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        {(currentPage - 1) * currentLimit + index + 1}
                    </Typography>
                ),
            },
            { header: "NO UKG", accessor: "no_ukg" },
            { header: "NAMA LENGKAP", accessor: "nama_lengkap" },
            { header: "NO HP", accessor: "no_hp" },
            { header: "NAMA SEKOLAH", accessor: "nama_sekolah" },
            { header: "NPSN SEKOLAH", accessor: "npsn_sekolah" },
            { header: "JENJANG SEKOLAH", accessor: "jenjang_sekolah" },
            { header: "PROVINSI SEKOLAH", accessor: "provinsi_sekolah" },
            { header: "KOTA/KAB SEKOLAH", accessor: "kota_kab_sekolah" },
            { header: "STATUS KESEDIAAN", accessor: "status_kesediaan" },
            { header: "WAKTU ISI KESEDIAAN", accessor: "waktu_isi_kesediaan", hide: true },
            { header: "KODE BS PPG", accessor: "kode_bs_ppg", hide: true },
            { header: "BIDANG STUDI PPG", accessor: "bidang_studi_ppg" },
            { header: "LPTK", accessor: "lptk" },
            { header: "STATUS PLOTTING", accessor: "status_plotting" },
            { header: "ALASAN", accessor: "alasan", hide: true },
            { header: "STATUS KONFIRMASI EMAIL", accessor: "status_konfirmasi_email", hide: true },
            { header: "WAKTU KONFIRMASI EMAIL", accessor: "waktu_konfirmasi_email", hide: true },
            { header: "EMAIL KONFIRMASI", accessor: "email_konfirmasi", hide: true },
            { header: "TAHAP", accessor: "tahap" },
            { header: "TAHUN", accessor: "tahun" },
        ],
        [currentPage, currentLimit]
    );

    const handleFetch = useCallback(
        (query, page, limit) => {
            getPpg({ query, page, limit });
        },
        [getPpg]
    );

    const handleUpload = useCallback(
        async (file) => {
            try {
                const formData = new FormData();
                formData.append("file", file);
                await uploadPpg(formData);
                showNotification("Data berhasil diupload!", "success");
            } catch (error) {
                showNotification(error.message || "Gagal mengunggah file", "error");
            }
        },
        [uploadPpg, showNotification]
    );

    return (
        <div className="w-full max-w-full flex flex-col h-[calc(100vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
            <DataTable
                isFetching={isFetching}
                columns={columns}
                dataTitle={"Data PPG"}
                data={ppgData}
                totalPages={totalPages}
                isLoading={isLoading}
                currentLimit={currentLimit}
                currentPage={currentPage}
                onFetch={handleFetch}
                onDelete={deletePpg}
                onUpload={handleUpload}
                initialSearch={currentQuery}
                filterOptions={kabupatenOptions}
                tahapOptions={tahapOptions}
                tahunOptions={tahunOptions}
                currentFilters={filters}
                onFilterChange={setFilters}
                onFilterOpen={handleFilterOpen}
            />
        </div>
    );
};

export default Ppg;