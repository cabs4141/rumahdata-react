
import React, { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
import { Inbox } from "@mui/icons-material";
import { COLORS } from "../chartConfig";

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

export const ChartCard = ({ title, children, xs = 12, md, height = 500 }) => (
    <Grid size={{ xs: xs, md: md ?? xs }}>
        <Paper
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
            <Typography variant="h6" fontWeight="600" mb={4} color="text.primary" fontSize="1.1rem">
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0 }}>
                {children}
            </Box>
        </Paper>
    </Grid>
);

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
