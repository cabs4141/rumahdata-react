import { useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";

const User = () => {
  const { getUserLists, userList } = useUserStore();
  useEffect(() => {
    getUserLists();
  }, [getUserLists]);
  return (
    <div className="mt-20">
      {userList?.map((user) => (
        <li key={user.id}>
          {user.nama}-{user.nip}-{user.status}-{user.role}
        </li>
      ))}
    </div>
  );
};

export default User;
