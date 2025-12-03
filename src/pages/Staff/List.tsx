import React from "react";
import StaffService from "../../services/Staff/Staff.Services";
import { StaffModel } from "../../types/Staff/StaffType";
import KiduServerTable from "../../components/Trip/KiduServerTable";
import { getFullImageUrl } from "../../constants/API_ENDPOINTS";

const columns = [
  { key: "staffUserId", label: "Staff ID" },
  { key: "profile", label: "Photo" },
  { key: "name", label: "Name" },
  { key: "mobileNumber", label: "Mobile Number" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "starRating", label: "Star Rating" },
  { key: "isBlocked", label: "Is Blocked" },
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

      // Transform data with profile images and star rating
      let transformedData = response.map((staff: StaffModel) => {
        const imageUrl = getFullImageUrl(staff.profileImagePath) || "/assets/Images/profile.jpeg";

        // Format star rating
        const rating = staff.starRating || 0;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const starDisplay = '⭐'.repeat(fullStars) + (hasHalfStar ? '✨' : '') + '☆'.repeat(emptyStars);

        return {
          ...staff,
          profile: imageUrl,
          starRating: starDisplay,
          isBlocked: staff.isBlocked ? "✓" : "✗",
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
      showAddButton={true}
      showExport={true}
    />
  );
};

export default StaffList;