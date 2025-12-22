// src/pages/settings/adminUsers/AdminUserList.tsx
import React from "react";
import type { User } from "../../../types/common/Auth.types";
import AdminUserService from "../../../services/settings/AdminUser.services";
import KiduServerTable from "../../../components/Trip/KiduServerTable";
import { getFullImageUrl } from "../../../constants/API_ENDPOINTS";
import defaultUserAvatar from "../../../assets/Images/profile.jpeg"; // Add default user avatar

const columns = [
  { key: "userId", label: "User ID" },
  { 
    key: "profilePic", 
    label: "Profile",
    type: "image" as const  
  },
  { key: "userName", label: "User Name" },
  { key: "companyName", label: "Company" },
  { key: "userEmail", label: "Email" },
  { key: "phoneNumber", label: "Phone" },
];

const AdminUserList: React.FC = () => {
  const fetchData = async (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    try {
      const response = await AdminUserService.getAll();
      
      // Check if response is successful
      if (!response || !response.isSucess) {
        throw new Error(response?.customMessage || response?.error || "Failed to fetch admin users");
      }

      // Extract data from response.value
      const allData = response.value || [];
      
      if (allData.length === 0) {
        return { data: [], total: 0 };
      }

      // ✅ Transform profile image paths to full URLs
      const transformedData = allData.map((user: User) => ({
        ...user,
        profilePic: user.profileImagePath 
          ? getFullImageUrl(user.profileImagePath) 
          : defaultUserAvatar // ✅ Use default user avatar if none exists
      }));

      let filteredData = transformedData;

      // Apply search filter if searchTerm exists
      if (params.searchTerm) {
        const s = params.searchTerm.toLowerCase();
        filteredData = transformedData.filter(user =>
          (user.userName || "").toLowerCase().includes(s) ||
          (user.userEmail || "").toLowerCase().includes(s) ||
          (user.phoneNumber || "").toLowerCase().includes(s) ||
          (user.companyName || "").toLowerCase().includes(s) ||
          (user.address || "").toLowerCase().includes(s) ||
          (user.userId?.toString() || "").includes(params.searchTerm)
        );
      }

      // Apply pagination
      const start = (params.pageNumber - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginatedData = filteredData.slice(start, end);

      return { 
        data: paginatedData, 
        total: filteredData.length 
      };
    } catch (error: any) {
      console.error("Error fetching admin users:", error);
      throw new Error(`Failed to fetch admin user details: ${error.message}`);
    }
  };

  return (
    <KiduServerTable
      title="Admin User Details"
      subtitle="List of all admin users with Edit & View options"
      columns={columns}
      idKey="userId"
      addButtonLabel="Add New Admin User"
      addRoute="/dashboard/settings/create-adminUser"
      editRoute="/dashboard/settings/edit-adminUser"
      viewRoute="/dashboard/settings/view-adminUser"
      fetchData={fetchData}
      showSearch={true}
      showActions={true}
      showExport={true}
      showAddButton={true}
      rowsPerPage={10}
    />
  );
};

export default AdminUserList;