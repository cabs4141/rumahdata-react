import { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import PageBreadcrumb from "../../components/molecules/PageBreadCrumb";
import PageMeta from "../../components/atoms/PageMeta";
import PersonalizationTab from "./PersonalizationTab";

const TabPanel = ({ children, value, index }) => (
    <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
);

const Settings = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <PageMeta
                title="Pengaturan | Rumah Data"
                description="Halaman pengaturan website"
            />
            {/* <PageBreadcrumb pageTitle="Pengaturan" /> */}

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 4,
                        pt: 3,
                        pb: 0,
                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                        <TuneIcon sx={{ color: "#1976d2", fontSize: 28 }} />
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Pengaturan
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Kelola konfigurasi dan personalisasi website
                            </Typography>
                        </Box>
                    </Box>

                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        sx={{
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                                minHeight: 48,
                            },
                        }}
                    >
                        <Tab label="Personalisasi" />
                        {/* Tab tambahan bisa ditambahkan di sini */}
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <TabPanel value={activeTab} index={0}>
                        <PersonalizationTab />
                    </TabPanel>
                </Box>
            </Paper>
        </div>
    );
};

export default Settings;
