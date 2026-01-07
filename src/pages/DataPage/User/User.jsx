import { Chip } from "@mui/material";
import { useUserStore } from "../../../stores/useUserStore";
import DataTable from "../DataTable";

const User = () => {
  const { getUserLists, userList, isLoading, currentLimit, currentPage, totalPages } = useUserStore();
  const columns = [
    { header: "NIP", accessor: "nip" },
    { header: "NAMA", accessor: "nama" },
    {
      header: "ROLE",
      accessor: "role",
      render: (row) => <Chip label={row.role} size="small" color={getRoleColor(row.role)} variant="outlined" />,
    },
    { header: "STATUS", accessor: "status" },
    { header: "AKSI", accessor: "aksi" },
  ];
  // Handler untuk warna label Role/Status (Opsional)
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return "error";
      case "admin":
        return "warning";
      default:
        return "primary";
    }
  };
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-[calc(175vh-140px)] border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
      <DataTable columns={columns} isLoading={isLoading} data={userList} onFetch={getUserLists} currentLimit={currentLimit} currentPage={currentPage} totalPages={totalPages} dataTitle={"Data User"} />
    </div>
  );
};

export default User;
