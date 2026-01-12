import React from "react";
import { Box, Typography, Button, Paper, Divider, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const SidebarWidget = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        mt: 6,
        mx: 2,
        mb: 5,
        p: 2.5,
        borderRadius: 1,
        bgcolor: "background.paper",
        borderColor: "divider",
        textAlign: "center",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.03)",
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        {/* Icon Lambang Formalitas */}
        <InfoOutlinedIcon color="primary" sx={{ fontSize: 28 }} />

        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          >
            Rumah Data BGTK NTB
          </Typography>

          <Divider sx={{ my: 1, width: "40px", mx: "auto", borderBottomWidth: 2, bgcolor: "primary.main" }} />

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              lineHeight: 1.5,
              px: 1,
            }}
          >
            Pusat pengembangan kompetensi dan pemberdayaan tenaga kependidikan.
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: "1rem !important" }} />}
          href="https://bgtkntb.kemendikdasmen.go.id/" // Contoh link instansi
          target="_blank"
          sx={{
            py: 1,
            textTransform: "none",
            borderRadius: 1,
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              bgcolor: "primary.dark",
            },
          }}
        >
          Portal Resmi
        </Button>
      </Stack>
    </Paper>
  );
};

export default SidebarWidget;
