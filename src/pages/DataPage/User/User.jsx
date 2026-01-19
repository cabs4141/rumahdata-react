import { useUserStore } from "../../../stores/useUserStore";
import DataTable from "../DataTable";
import { Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

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
                color: row.role === "super_admin" ? "error.main" : row.role === "admin" ? "warning.main" : "primary.main",
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.role?.toUpperCase()}
            </Typography>
          </Stack>
        ),
      },
      {
        header: "STATUS",
        accessor: "status",
        render: (row) => (
          <Stack direction="row" spacing={1} alignItems="center">
            {row.status === "approved" ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: "bold" }}>
                  AKTIF
                </Typography>
              </>
            ) : (
              <>
                <PendingIcon sx={{ fontSize: 16, color: "primary.main" }} />
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: "bold" }}>
                  PENDING
                </Typography>
              </>
            )}
          </Stack>
        ),
      },
    ],
    [currentLimit, currentPage]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-[calc(175vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
      <DataTable isFetching={isFetching} columns={columns} isLoading={isLoading} data={userList} onFetch={getUserLists} currentLimit={currentLimit} currentPage={currentPage} totalPages={totalPages} dataTitle={"Data User"} />
    </div>
  );
};

export default User;
