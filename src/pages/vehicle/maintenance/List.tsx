// src/components/VehicleMaintenance/ListVehicleMaintenance.tsx
import React, { useCallback, useEffect, useState } from "react";
import VehicleMaintenanceService from "../../../services/vehicle/Maintenance.services";
import KiduLoader from "../../../components/KiduLoader";
import KiduTable from "../../../components/KiduTable";
import type { Maintenance } from "../../../types/vehicle/Maintenance.types";

const columns = [
    { key: "vehicleMaintenanceRecordId", label: "Maintenance ID" },
    { key: "maintenanceDateString", label: "Date", },
    { key: "maintenanceType", label: "Type" },
    { key: "workshopName", label: "Workshop" },
    { key: "cost", label: "Cost" },
];

const VehicleMaintenanceList: React.FC = () => {
    const [records, setRecords] = useState<Maintenance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await VehicleMaintenanceService.getAll();
            console.log(res);

            if (res.isSucess && Array.isArray(res.value)) {
                setRecords(res.value);
                setError(null);
            } else {
                setError("Failed to load vehicle maintenance records");
            }
        } catch (err: any) {
            setError("Error fetching vehicle maintenance data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) return <KiduLoader type="vehicle maintenance..." />;

    return (
        <>
            <KiduTable
                title="Vehicle Maintenance"
                subtitle="List of all vehicle maintenance records with quick edit & view actions"
                columns={columns}
                data={records}
                addButtonLabel="Add Vehicle Maintenance"
                addRoute="/dashboard/vehicles/create-maintenance"
                editRoute="/dashboard/vehicles/edit-maintenance"
                viewRoute="/dashboard/vehicles/view-maintenance"
                idKey="vehicleMaintenanceRecordId"
                error={error}
                onRetry={loadData}
            />
        </>
    );
};

export default VehicleMaintenanceList;
