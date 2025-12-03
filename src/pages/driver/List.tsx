import React, { useEffect, useState, useCallback } from "react";
import type { Driver } from "../../types/Driver.types";
import KiduTable from "../../components/KiduTable";
import DriverCalender from "./DriverCalender";
import DriverService from "../../services/Driver.services";
import KiduLoader from "../../components/KiduLoader";
//import { getFullImageUrl } from "../../constants/API_ENDPOINTS";
//import defaultProfile from "../../assets/Images/profile.jpeg";

const columns = [
    { key: "driverId", label: "Driver ID" },
    { key: "profile", label: "Photo" },
    { key: "driverName", label: "Driver Name" },
    { key: "license", label: "License Number" },
    { key: "nationality", label: "Nationality" },
    { key: "contactNumber", label: "Phone Number" },
];

const DriverList: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAvailability, setShowAvailability] = useState(false);
    const [selectedDriver] = useState<Driver | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await DriverService.getAll();

            // if (res.isSucess && res.value) {
            //     // ✅ Transform data and add 'profile' field for KiduTable
            //     // const transformedDrivers = res.value.map((driver: Driver) => {
            //     //     const imageUrl = driver.profileImagePath 
            //     //         ? getFullImageUrl(driver.profileImagePath)
            //     //         : defaultProfile;
                    
            //     //     console.log(`Driver ${driver.driverId} - Original path:`, driver.profileImagePath, '→ Full URL:', imageUrl);
                    
            //     //     return {
            //     //         ...driver,
            //     //         profile: imageUrl  // ✅ Add 'profile' field for KiduTable
            //     //     };
            //     // });
                
            //     setDrivers(transformedDrivers);
            //     setError(null);
            // } else {
            //     setError("Failed to fetch drivers");
            // }
        } catch (err) {
            console.error("Error loading drivers:", err);
            setError("An error occurred while fetching drivers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // const handleAvailabilityClick = (driver: Driver) => {
    //     setSelectedDriver(driver);
    //     setShowAvailability(true);
    // };

    if (loading) return <KiduLoader type="driver..." />;

    return (
        <>
            <KiduTable
                title="Driver Details"
                subtitle="List of all drivers with quick edit & view actions"
                columns={columns}
                data={drivers}
                addButtonLabel="Add New Driver"
                idKey="driverId"
                addRoute="/dashboard/driver-create"
                editRoute="/dashboard/driver-edit"
                viewRoute="/dashboard/driver-view"
                error={error}
                onRetry={loadData}
            />

            {selectedDriver && (
                <DriverCalender
                    show={showAvailability}
                    onHide={() => setShowAvailability(false)}
                    driverId={String(selectedDriver.driverId)}
                    driverName={selectedDriver.driverName}
                />
            )}
        </>
    );
};

export default DriverList;