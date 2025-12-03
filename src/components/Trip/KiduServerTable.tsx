import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button, Row, Col, Container, Pagination } from "react-bootstrap";
import { FaEdit, FaEye, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from "@tanstack/react-table";
import KiduLoader from "../KiduLoader";
import KiduSearchBar from "../KiduSearchBar";
import KiduButton from "../KiduButton";
import KiduExcelButton from "../KiduExcelButton";
import KiduPopupButton from "../KiduPopupButton";

interface Column {
  key: string;
  label: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
}

interface KiduServerTableProps {
  title?: string;
  subtitle?: string;
  columns: Column[];
  idKey?: string;
  addButtonLabel?: string;
  addRoute?: string;
  viewRoute?: string;
  editRoute?: string;
  showAddButton?: boolean;
  showKiduPopupButton?: boolean;
  showExport?: boolean;
  onRowClick?: (item: any) => void;
  onAddClick?: () => void;
  showSearch?: boolean;
  showActions?: boolean;
  showTitle?: boolean;
  fetchData: (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm: string;
  }) => Promise<{ data: any[]; total: number }>;
  rowsPerPage?: number;
}

const KiduServerTable: React.FC<KiduServerTableProps> = ({
  title = "Table",
  subtitle = "",
  columns,
  idKey = "id",
  addButtonLabel = "Add New",
  addRoute,
  viewRoute,
  editRoute,
  showAddButton = true,
  showKiduPopupButton = false,
  showExport = true,
  onRowClick,
  onAddClick,
  showSearch = true,
  showActions = true,
  showTitle = true,
  fetchData,
  rowsPerPage = 10,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // React Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const totalPages = Math.ceil(total / rowsPerPage);

  const loadData = useCallback(
    async (page: number, search: string) => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 KiduServerTable - Loading data for:", {
          page,
          search,
          rowsPerPage,
        });

        const result = await fetchData({
          pageNumber: page,
          pageSize: rowsPerPage,
          searchTerm: search,
        });

        console.log("📊 KiduServerTable - Received data:", {
          dataLength: result.data?.length,
          total: result.total,
          firstItem: result.data?.[0],
        });

        setData(result.data || []);
        setTotal(result.total || 0);
      } catch (err: any) {
        console.error("❌ KiduServerTable - Error:", err);
        setError(err.message || "Failed to load data");
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, rowsPerPage]
  );

  useEffect(() => {
    console.log("🚀 KiduServerTable - Initial load");
    loadData(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "" || currentPage !== 1) {
        console.log("🔍 KiduServerTable - Search triggered:", searchTerm);
        setCurrentPage(1);
        loadData(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, loadData]);

  useEffect(() => {
    if (currentPage !== 1 || searchTerm !== "") {
      console.log("📄 KiduServerTable - Page changed:", currentPage);
      loadData(currentPage, searchTerm);
    }
  }, [currentPage, loadData, searchTerm]);

  // Define columns for React Table
  const tableColumns = useMemo<ColumnDef<any>[]>(() => {
    const cols: ColumnDef<any>[] = columns.map((col) => ({
      accessorKey: col.key,
      header: col.label,
      enableSorting: col.enableSorting !== false,
      enableColumnFilter: col.enableFiltering !== false,
      cell: ({ getValue, row }) => {
        const value = getValue();
        if (col.key === "profile") {
          return (
            <img
              src={(value as string) || "/assets/Images/profile.jpeg"}
              alt="Profile"
              style={{ width: 45, height: 45, borderRadius: "50%" }}
            />
          );
        }
        return value as string;
      },
    }));

    // Add actions column
    if (showActions) {
      cols.push({
        id: "actions",
        header: () => (
          <div className="d-flex justify-content-between align-items-center w-100">
            <span className="ms-5">Action</span>
            {showExport && total > 0 && (
              <div>
                <KiduExcelButton data={data} title={title} />
              </div>
            )}
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <div
            className="d-flex justify-content-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {editRoute && (
              <Button
                size="sm"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #18575A",
                  color: "#18575A",
                  fontSize: "13px",
                  padding: "4px 8px",
                }}
                onClick={() => {
                  navigate(`${editRoute}/${row.original[idKey]}`);
                }}
              >
                <FaEdit className="me-1" /> Edit
              </Button>
            )}

            {viewRoute && (
              <Button
                size="sm"
                style={{
                  backgroundColor: "#18575A",
                  border: "none",
                  color: "white",
                  fontSize: "13px",
                  padding: "4px 8px",
                }}
                onClick={() => {
                  navigate(`${viewRoute}/${row.original[idKey]}`);
                }}
              >
                <FaEye className="me-1" /> View
              </Button>
            )}
          </div>
        ),
      });
    }

    return cols;
  }, [columns, showActions, showExport, total, data, title, editRoute, viewRoute, navigate, idKey]);

  // Create React Table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleRetry = () => {
    loadData(currentPage, searchTerm);
  };

  const fieldName = title ? title.replace("Select ", "") : addButtonLabel;

  if (loading && data.length === 0) return <KiduLoader type="trip..." />;

  if (error && data.length === 0) {
    return (
      <Container fluid className="py-3 mt-5">
        <div className="alert alert-danger">{error}</div>
        <Button
          onClick={handleRetry}
          style={{ backgroundColor: "#18575A", border: "none" }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3 mt-4">
      {showTitle !== false && total > 0 && (
        <Row className="mb-2 align-items-center">
          <Col>
            <h4 className="mb-0 fw-bold" style={{ fontFamily: "Urbanist" }}>
              {title}
            </h4>
            {subtitle && (
              <p className="text-muted" style={{ fontFamily: "Urbanist" }}>
                {subtitle}
              </p>
            )}
          </Col>
        </Row>
      )}

      {total > 0 && (
        <Row className="mb-3 align-items-center">
          {showSearch && (
            <Col>
              <KiduSearchBar
                placeholder="Search..."
                onSearch={(val) => setSearchTerm(val)}
                width="250px"
              />
            </Col>
          )}

          {showAddButton && addRoute && (
            <Col xs="auto" className="text-end">
              <KiduButton
                label={`+ ${addButtonLabel}`}
                to={addRoute}
                className="fw-bold d-flex align-items-center text-white"
                style={{
                  backgroundColor: "#18575A",
                  border: "none",
                  height: 45,
                  width: 200,
                }}
              />
            </Col>
          )}
        </Row>
      )}

      <Row>
        <Col>
          <div ref={tableRef} className="table-responsive">
            <table
              className="table table-striped table-bordered table-hover align-middle mb-0"
              style={{ fontSize: "14px" }}
            >
              <thead
                className="table-light text-center"
                style={{ fontFamily: "Urbanist" }}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ padding: "10px 12px", cursor: header.column.getCanSort() ? "pointer" : "default" }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span>
                              {header.column.getIsSorted() === "asc" ? (
                                <FaSortUp />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <FaSortDown />
                              ) : (
                                <FaSort style={{ opacity: 0.3 }} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody
                className="text-center"
                style={{ fontFamily: "Urbanist" }}
              >
                {loading ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="text-center py-5"
                    >
                      <KiduLoader type="trip..." />
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="text-center py-5"
                      style={{ border: "2px solid #dee2e6" }}
                    >
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <p className="text-muted mb-3">
                          No matching records found
                        </p>

                        {showKiduPopupButton && addRoute && (
                          <KiduPopupButton
                            label={`Add ${fieldName}`}
                            onClick={() => {
                              if (onAddClick) onAddClick();
                              else if (addRoute) navigate(addRoute);
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick?.(row.original)}
                      style={{
                        cursor: onRowClick ? "pointer" : "default",
                        lineHeight: "1.2",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ padding: "8px 12px" }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4 px-2">
          <span
            style={{
              fontFamily: "Urbanist",
              color: "#18575A",
              fontWeight: 600,
            }}
          >
            Page {currentPage} of {totalPages} (Total: {total} records)
          </span>

          <Pagination className="m-0">
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    backgroundColor:
                      pageNum === currentPage ? "#18575A" : "white",
                    borderColor: "#18575A",
                    color: pageNum === currentPage ? "white" : "#18575A",
                  }}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default KiduServerTable;