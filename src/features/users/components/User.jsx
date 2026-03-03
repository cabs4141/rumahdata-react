import { useUserStore } from "@/features/users/stores/useUserStore";
import DataTable from "@/pages/DataPage/DataTable";
import ModalCreateUser from "@/features/users/components/ModalCreateUser";
import { Stack, Typography, Button, Box, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useShallow } from "zustand/react/shallow";
import { useMemo, useState } from "react";

const PERMISSION_OPTIONS = [
  { id: 1, label: "PTK", value: "ptk" },
  { id: 2, label: "KEGIATAN", value: "kegiatan" },
  { id: 6, label: "SEKOLAH", value: "sekolah" },
  { id: 7, label: "PPG", value: "ppg" },
  { id: 8, label: "PEMETAAN KOMPETENSI", value: "pemetaan_kompetensi" }
];

const User = () => {
  const { isFetching, getUserLists, userList, isLoading, currentLimit, currentPage, totalPages } = useUserStore(
    useShallow((state) => ({
      isFetching: state.isFetching,
      getUserLists: state.getUserLists,
      userList: state.userList,
      isLoading: state.isLoading,
      currentLimit: state.currentLimit,
      currentPage: state.currentPage,
      totalPages: state.totalPages,
    }))
  );

  const [openCreate, setOpenCreate] = useState(false);

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
      { header: "NAMA", accessor: "nama" },
      { header: "NIP", accessor: "nip" },
      {
        header: "ROLE",
        accessor: "role",
        render: (row) => (
          <Stack direction="row" spacing={1} alignItems="center">
            <FiberManualRecordIcon
              sx={{
                fontSize: 10,
                color: row.role === "admin" ? "error.main" : "primary.main",
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.role?.toUpperCase()}
            </Typography>
          </Stack>
        ),
      },
      {
        header: "HAK AKSES",
        accessor: "permissions",
        render: (row) => {
          if (row.role === "admin") {
            return (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                Akses Penuh
              </Typography>
            );
          }

          let permsArray = [];
          if (Array.isArray(row.permissions)) {
            permsArray = row.permissions;
          } else if (typeof row.permissions === "string" && row.permissions.trim() !== "") {
            try {
              permsArray = JSON.parse(row.permissions);
              if (!Array.isArray(permsArray)) permsArray = [permsArray];
            } catch (e) {
              permsArray = row.permissions.split(',').map(s => s.trim());
            }
          }

          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Chip label="DASHBOARD" size="small" color="default" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
              <Chip label="SPLIT DATA" size="small" color="default" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
              <Chip label="STATISTIK" size="small" color="default" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
              {permsArray.map((perm, index) => {
                const isObj = typeof perm === 'object' && perm !== null;
                const pVal = isObj ? (perm.name || perm.value) : perm;
                const pId = isObj ? (perm.id || perm.permission_id) : Number(perm);

                const opt = PERMISSION_OPTIONS.find(o => o.value === pVal || o.id === pId);
                if (!opt) return null;
                return (
                  <Chip
                    key={index}
                    label={opt.label}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 22 }}
                  />
                );
              })}
            </Box>
          );
        }
      },

    ],
    [currentLimit, currentPage]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-[calc(175vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
      <DataTable
        isFetching={isFetching}
        columns={columns}
        isLoading={isLoading}
        data={userList}
        onFetch={getUserLists}
        currentLimit={currentLimit}
        currentPage={currentPage}
        totalPages={totalPages}
        dataTitle={"Data User"}
        extraActions={
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)} sx={{ textTransform: "none" }}>
            TAMBAH USER
          </Button>
        }
      />
      <ModalCreateUser isOpen={openCreate} handleClose={() => setOpenCreate(false)} onRefresh={() => getUserLists()} />
    </div>
  );
};

export default User;
