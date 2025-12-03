// ============================================
// KiduPopup.tsx - FINAL FIXED VERSION
// ============================================
import React, { useState, useEffect, useMemo } from "react";
import { Modal} from "react-bootstrap";
import HttpService from "../services/common/HttpService";
import KiduTable from "./KiduTable";
import KiduSearchBar from "./KiduSearchBar";
import type { CustomResponse } from "../types/common/ApiTypes";
import KiduLoader from "./KiduLoader";

interface KiduPopupProps<T> {
  show: boolean;
  handleClose: () => void;
  title: string;
  fetchEndpoint: string;
  columns: { key: keyof T; label: string }[];
  onSelect?: (item: T) => void;
  AddModalComponent?: React.ComponentType<{
    show: boolean;
    handleClose: () => void;
    onAdded: (newItem: T) => void;
  }>;
  searchKeys?: (keyof T)[];
}

function KiduPopup<T extends Record<string, any>>({
  show,
  handleClose,
  title,
  fetchEndpoint,
  columns,
  onSelect,
  AddModalComponent,
  searchKeys
}: KiduPopupProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // 🔹 Fetch data when modal opens
  useEffect(() => {
    if (!show) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery("");
    setLoading(true);
    HttpService.callApi<CustomResponse<T[]>>(fetchEndpoint, "GET")
      .then(res => {
        if (Array.isArray(res)) setData(res);
        else if ((res.isSuccess || res.isSucess) && Array.isArray(res.value)) setData(res.value);
        else if (res.value && typeof res.value === "object" && Array.isArray((res.value as any).data))
          setData((res.value as any).data);
        else console.warn("⚠️ Unexpected API format:", res);
      })
      .catch(err => console.error("❌ Error fetching popup data:", err))
      .finally(() => setLoading(false));
  }, [show, fetchEndpoint]);

  // 🔹 Filter data based on search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys?.length) return data;
    return data.filter(item =>
      searchKeys.some(key =>
        item[key] && item[key].toString().toLowerCase().includes(q)
      )
    );
  }, [query, data, searchKeys]);

  const handleRowClick = (item: T) => {
    onSelect?.(item);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered className="head-font">
        <Modal.Header closeButton style={{ backgroundColor:"#f8f9fa" }}>
          <Modal.Title className="fs-6 fw-semibold text-dark">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ minHeight:"300px" }}>
          {loading ? (
              <KiduLoader type="..." />
           
          ) : (
            <>
              {/* 🔹 Search bar always visible at top */}
              <div className="px-2">
                <KiduSearchBar
                  onSearch={setQuery}
                  placeholder="Search records..."
                />
              </div>

              {/* 🔹 Table without its own search bar and title */}
              <KiduTable
                showKiduPopupButton={true}
                columns={columns.map(col => ({ key:String(col.key), label:col.label }))}
                data={filtered}
                showActions={false}
                showSearch={false}
                showTitle={false} // This hides the title/subtitle row in KiduTable
                onRowClick={handleRowClick}
                AddModalComponent={AddModalComponent}
                title={title}
                onAddClick={() => setShowAddModal(true)}
              />
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* 🔹 Add Modal */}
      {AddModalComponent && (
        <AddModalComponent
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          onAdded={newItem => {
            setData(prev => [...prev, newItem]);
            setShowAddModal(false);
          }}
        />
      )}
    </>
  );
}

export default KiduPopup;