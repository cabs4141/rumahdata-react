
import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const COLORS = {
    primary: "#3C50E0",
    secondary: "#80CAEE",
    success: "#10B981",
    warning: "#FFA70B",
    danger: "#E11D48",
    dark: "#1C2434",
    text: "#64748B",
    bg_card: "#FFFFFF",
};

const KPICard = ({ title, value, icon, color, to, variant = "outlined" }) => {

    const isFilled = variant === "filled";

    const CardContent = (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: '16px',
                border: isFilled ? 'none' : '1px solid #EFF4FB',
                boxShadow: isFilled ? '0px 4px 20px rgba(0, 0, 0, 0.05)' : '0px 1px 3px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: '100%',
                background: isFilled ? color : COLORS.bg_card,
                color: isFilled ? '#fff' : 'text.primary',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': to ? {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer'
                } : {}
            }}
        >
            <Box sx={{
                width: 56, height: 56, borderRadius: '50%',
                bgcolor: isFilled ? 'rgba(255, 255, 255, 0.2)' : `${color}15`,
                color: isFilled ? '#fff' : color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="h4" fontWeight="700" color="inherit" sx={{ lineHeight: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    {value}
                </Typography>
                <Typography variant="body1" color={isFilled ? 'rgba(255,255,255,0.9)' : 'text.secondary'} fontWeight="500" sx={{ mt: 0.5 }}>
                    {title}
                </Typography>
            </Box>
        </Paper>
    );

    if (to) {
        return (
            <Link to={to} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                {CardContent}
            </Link>
        );
    }

    return (
        <div style={{ height: '100%' }}>
            {CardContent}
        </div>
    );
};

export default KPICard;
