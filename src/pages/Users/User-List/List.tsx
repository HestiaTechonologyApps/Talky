import React, { useEffect, useState, useCallback } from "react";
import { User } from "../../../types/ApiTypes";
import AppUserService from "../../../services/AppUserServices";
import KiduTable from "../../../components/KiduTable";
import KiduLoader from "../../../components/KiduLoader";
import toast from "react-hot-toast";

const columns = [
  { key: "appUserId", label: "ID" },
  { key: "name", label: "Name" },
  { key: "mobileNumber", label: "Mobile Number" },
  {
    key: "registeredDate",
    label: "Joined On",
    render: (row: User) => {
      const date = new Date(row.registeredDate);
      return `${String(date.getDate()).padStart(2, "0")}-${date.toLocaleString(
        "en-US",
        { month: "long" }
      )}-${date.getFullYear()}`;
    },
  },
  { key: "status", label: "Status" },
  {
    key: "isBlocked",
    label: "Is Blocked",
    render: (row: User) => <input type="checkbox" checked={row.isBlocked} disabled />,
  },
  {
    key: "walletBalance",
    label: "Wallet Balance",
    render: (row: User) => <span>{row.walletBalance?.toFixed(2)}</span>,
  },
];

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AppUserService.getAllUsers();

      if (response && Array.isArray(response)) {
        setUsers(response);
        setError(null);
      } else {
        setError("Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
      toast.error("Error fetching user list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (loading) return <KiduLoader type="Loading Users..." />;

  return (
    <KiduTable
      title="User Management"
      subtitle="List of all registered users with actions"
      data={users}
      columns={columns}
      idKey="appUserId"
      addButtonLabel="Add New User"
      addRoute="/user-management/create-user"
       editRoute="/dashboard/user/edit-user"

      // KiduTable will append /id
      viewRoute="/dashboard/user/view-user"   // KiduTable will append /id
      error={error}
      onRetry={loadUsers}
    />
  );
};

export default UserPage;
