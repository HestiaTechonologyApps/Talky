import React from "react";
import StaffService from "../../services/Staff/Staff.Services";
import { StaffModel } from "../../types/Staff/StaffType";
import KiduServerTable from "../../components/Trip/KiduServerTable";
import { getFullImageUrl } from "../../constants/API_ENDPOINTS";

// ✅ Added type property to columns
const columns = [
  { key: "staffUserId", label: "Staff ID", type: "text" as const },
  { key: "profile", label: "Photo", type: "image" as const }, // ✅ Changed to image type
  { key: "name", label: "Name", type: "text" as const },
  { key: "mobileNumber", label: "Mobile Number", type: "text" as const },
  { key: "email", label: "Email", type: "text" as const },
  { key: "address", label: "Address", type: "text" as const },
  { key: "starRating", label: "Star Rating", type: "rating" as const }, 
  { key: "isBlocked", label: "Is Blocked", type: "checkbox" as const }, 
];

const StaffList: React.FC = () => {
  // Server-side pagination fetch function
  const fetchStaffData = async ({
    pageNumber,
    pageSize,
    searchTerm,
  }: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => {
    try {
      console.log("📡 Fetching staff data:", { pageNumber, pageSize, searchTerm });

      // Get all staff from API
      const response = await StaffService.getAllStaff();

      if (!response || response.length === 0) {
        return { data: [], total: 0 };
      }

      // ✅ Transform data - keep raw values, let KiduServerTable handle formatting
      let transformedData = response.map((staff: StaffModel) => {
        // Get full image URL
        const imageUrl = staff.profileImagePath 
          ? getFullImageUrl(staff.profileImagePath) 
          : null;

        return {
          ...staff,
          profile: imageUrl, // ✅ Pass the URL, not formatted string
          starRating: staff.starRating || 0, // ✅ Pass raw number for rating type
          isBlocked: staff.isBlocked, // ✅ Pass boolean for checkbox type
        };
      });

      // Client-side search filtering
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        transformedData = transformedData.filter(
          (staff) =>
            staff.name?.toLowerCase().includes(lowerSearch) ||
            staff.email?.toLowerCase().includes(lowerSearch) ||
            staff.mobileNumber?.includes(searchTerm) ||
            staff.staffUserId?.toString().includes(searchTerm)
        );
      }

      const total = transformedData.length;

      // Client-side pagination
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = transformedData.slice(startIndex, endIndex);

      console.log("✅ Staff data fetched:", {
        total,
        pageData: paginatedData.length,
        firstItem: paginatedData[0]
      });

      return {
        data: paginatedData,
        total: total,
      };
    } catch (error) {
      console.error("❌ Error fetching staff:", error);
      throw new Error("Failed to load staff data");
    }
  };

  return (
    <KiduServerTable
      title="Staff Management"
      subtitle="List of all staff members with quick edit & view actions"
      columns={columns}
      idKey="staffUserId"
      addButtonLabel="Add New Staff"
      addRoute="/staff-management/staff-create"
      editRoute="/dashboard/staff/staff-Edit"
      viewRoute="/dashboard/staff/staff-view"
      
      fetchData={fetchStaffData}
      rowsPerPage={15}
      showSearch={true}
      showActions={true}
      showAddButton={false}
      showExport={true}
    />
  );
};

export default StaffList;