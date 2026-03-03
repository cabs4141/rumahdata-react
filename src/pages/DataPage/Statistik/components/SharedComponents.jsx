import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { Box, Paper, Typography, Grid, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Inbox, Download } from "@mui/icons-material";
import { COLORS } from "@/pages/DataPage/Statistik/chartConfig";
import html2canvas from "html2canvas";

export const ResizableChart = ({ options, series, type, height }) => {
    const containerRef = useRef(null);
    const [chartWidth, setChartWidth] = useState("100%");

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect) {
                    setChartWidth(Math.floor(entry.contentRect.width));
                }
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', minWidth: 0 }}>
            <Chart
                options={options}
                series={series}
                type={type}
                height={height}
                width={chartWidth}
            />
        </div>
    );
};

// KPICard has been moved to src/components/molecules/KPICard.jsx

export const ChartCard = ({ title, children, xs = 12, md, height = 500 }) => {
    const cardRef = useRef(null);

    const handleExport = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: COLORS.bg_card || "#ffffff",
                scale: 2 // High-res export
            });
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `${title.replace(/\\s+/g, '_').toLowerCase()}_chart.png`;
            link.href = url;
            link.click();
        } catch (error) {
            console.error("Export failed:", error);
        }
    };

    return (
        <Grid size={{ xs: xs, md: md ?? xs }}>
            <Paper
                ref={cardRef}
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    borderRadius: '16px',
                    border: '1px solid #EFF4FB',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.03)',
                    height: '100%',
                    minHeight: height,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: COLORS.bg_card,
                    overflow: 'hidden' // Prevent chart overflow
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h6" fontWeight="600" color="text.primary" fontSize="1.1rem">
                        {title}
                    </Typography>
                    <Tooltip title="Ekspor Grafik (PNG)">
                        <IconButton
                            onClick={handleExport}
                            size="small"
                            sx={{ color: '#64748B', '&:hover': { color: '#3B82F6', bgcolor: '#EFF6FF' } }}
                        >
                            <Download fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0 }}>
                    {children}
                </Box>
            </Paper>
        </Grid>
    );
};

export const Loading = () => <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%"><CircularProgress size={30} /></Box>;

export const NoData = ({ message = "Data Tidak Tersedia" }) => (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" width="100%" color="text.secondary">
        <Box sx={{
            width: 64, height: 64, borderRadius: '50%',
            bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
        }}>
            <Inbox fontSize="large" sx={{ opacity: 0.5 }} />
        </Box>
        <Typography variant="body1" fontWeight="500">{message}</Typography>
    </Box>
);
