import React, { useState } from "react";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import { useStatistikData } from "@/pages/DataPage/Statistik/useStatistikData";
import SekolahCharts from "@/features/sekolah/components/SekolahCharts";
import PtkCharts from "@/features/ptk/components/PtkCharts";
import PpgCharts from "@/features/ppg/components/PpgCharts";

const Statistik = () => {

    const [tabValue, setTabValue] = useState(0);

    const {
        isSekolahLoading,
        isPtkLoading,
        isPpgLoading,
        sekolahStatistik,
        ptkStatistikWithKabupaten,
        ppgStatistik,
        kabupatenStatusData,
        kabupatenTotalData,
    } = useStatistikData(tabValue);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
            {/* <Box mb={5}>
                <Typography variant="h4" fontWeight="800" color="#1C2434" mb={1}>
                    Statistik
                </Typography>
            </Box> */}

            {/* Tabs Section */}
            <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="statistik tabs"
                >
                    <Tab label="Data Sekolah" />
                    <Tab label="Data PTK" />
                    <Tab label="Data PPG" />
                </Tabs>
            </Paper>

            {/* Charts Section */}
            <Box sx={{ mt: 2 }}>
                {tabValue === 0 && (
                    <SekolahCharts
                        isLoading={isSekolahLoading}
                        hasData={sekolahStatistik && sekolahStatistik.length > 0}
                        sekolahStatistik={sekolahStatistik}
                        kabupatenStatusData={kabupatenStatusData}
                        kabupatenTotalData={kabupatenTotalData}
                    />
                )}
                {tabValue === 1 && (
                    <PtkCharts
                        isLoading={isPtkLoading}
                        hasData={ptkStatistikWithKabupaten && ptkStatistikWithKabupaten.length > 0}
                        ptkStatistik={ptkStatistikWithKabupaten}
                    />
                )}
                {tabValue === 2 && (
                    <PpgCharts
                        isLoading={isPpgLoading}
                        hasData={ppgStatistik && ppgStatistik.length > 0}
                        ppgStatistik={ppgStatistik}
                    />
                )}
            </Box>
        </Box>
    );
};

export default Statistik;
