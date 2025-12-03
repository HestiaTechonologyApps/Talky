import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import {Bar,BarChart,CartesianGrid,Legend,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis,PieChart,Pie,Cell,} from "recharts";
import type { ExpenseCategoryData, MonthlyData, TripCountData, VehicleStatusData } from "../types/dashboard/TripDashboard.types";
import DashboardService from "../services/dashboard/Dashboard.services";
import KiduLoader from "../components/KiduLoader";

// Color Palette for a modern look
const PRIMARY_COLOR = "#007bff"; // Blue for general trends
const SUCCESS_COLOR = "#28a745"; // Green for revenue/available
const DANGER_COLOR = "#dc3545"; // Red for expenses/maintenance
const WARNING_COLOR = "#ffc107"; // Yellow for trips/utilization

// 1. Financial/Monthly Data (Existing structure)
const dummyMonthlyData: MonthlyData[] = [
  { month: "Jan", expense: 55000, invoice: 75000 },
  { month: "Feb", expense: 58000, invoice: 82000 },
  { month: "Mar", expense: 62000, invoice: 90000 },
  { month: "Apr", expense: 59000, invoice: 85000 },
  { month: "May", expense: 65000, invoice: 95000 },
  { month: "Jun", expense: 68000, invoice: 99000 },
  { month: "Jul", expense: 69000, invoice: 102000 },
  { month: "Aug", expense: 66000, invoice: 98000 },
  { month: "Sep", expense: 60000, invoice: 90000 },
  { month: "Oct", expense: 63000, invoice: 92000 },
  { month: "Nov", expense: 70000, invoice: 105000 },
  { month: "Dec", expense: 75000, invoice: 110000 },
];

// 2. Monthly Trip Count Data
const dummyTripCountData: TripCountData[] = [
  { month: "Jan", trips: 450 },
  { month: "Feb", trips: 480 },
  { month: "Mar", trips: 520 },
  { month: "Apr", trips: 490 },
  { month: "May", trips: 550 },
  { month: "Jun", trips: 570 },
  { month: "Jul", trips: 600 },
  { month: "Aug", trips: 580 },
  { month: "Sep", trips: 530 },
  { month: "Oct", trips: 550 },
  { month: "Nov", trips: 620 },
  { month: "Dec", trips: 650 },
];

// 3. Vehicle Status Data (Pie Chart)
const dummyVehicleStatusData: VehicleStatusData[] = [
  { name: "In Trip", value: 45, color: PRIMARY_COLOR },
  { name: "Available", value: 105, color: SUCCESS_COLOR },
  { name: "In Maintenance", value: 10, color: DANGER_COLOR },
  { name: "Off-Road", value: 5, color: WARNING_COLOR },
];

// 4. Top Expense Categories Data (Bar Chart)
const dummyExpenseCategoryData: ExpenseCategoryData[] = [
  { category: "Fuel", amount: 25000, fill: DANGER_COLOR },
  { category: "Salaries", amount: 18000, fill: PRIMARY_COLOR },
  { category: "Scheduled Maint.", amount: 8000, fill: WARNING_COLOR },
  { category: "Tolls/Fees", amount: 5500, fill: "#17a2b8" }, // Info color
  { category: "Insurance", amount: 4000, fill: "#6c757d" }, // Secondary color
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Only show the label if the segment is large enough
    if (percent * 100 < 5) return null; 
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            style={{ fontSize: '10px' }} // Smaller font size
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Charts: React.FC = () => {
  // State for all chart data
  const [monthlyFinancialData, setMonthlyFinancialData] = useState<MonthlyData[]>(dummyMonthlyData);
  const [tripCountData, setTripCountData] = useState<TripCountData[]>(dummyTripCountData);
  const [vehicleStatusData, setVehicleStatusData] = useState<VehicleStatusData[]>(dummyVehicleStatusData);
  const [expenseCategoryData, setExpenseCategoryData] = useState<ExpenseCategoryData[]>(dummyExpenseCategoryData);
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentYear = new Date().getFullYear();

        // Try to get complete dashboard summary first
        try {
          const summaryResponse = await DashboardService.getDashboardSummary(currentYear);
          console.log("Dashboard Summary API Response:", summaryResponse);

          if (summaryResponse.isSucess && summaryResponse.value) {
            const { monthlyFinancial, monthlyTripCount, vehicleStatus, expenseCategories } = summaryResponse.value;
            
            setMonthlyFinancialData(monthlyFinancial || dummyMonthlyData);
            setTripCountData(monthlyTripCount || dummyTripCountData);
            setVehicleStatusData(vehicleStatus || dummyVehicleStatusData);
            setExpenseCategoryData(expenseCategories || dummyExpenseCategoryData);
          } else {
            throw new Error("Summary endpoint returned invalid data");
          }
        } catch (summaryError) {
          console.log("Summary endpoint failed, fetching individual endpoints...", summaryError);
          
          // Fallback: Fetch each chart data individually
          const dashboardData = await DashboardService.refreshAllDashboardData(currentYear);
          console.log("Individual API Responses:", dashboardData);

          setMonthlyFinancialData(dashboardData.monthlyFinancial.length > 0 ? dashboardData.monthlyFinancial : dummyMonthlyData);
          setTripCountData(dashboardData.monthlyTripCount.length > 0 ? dashboardData.monthlyTripCount : dummyTripCountData);
          setVehicleStatusData(dashboardData.vehicleStatus.length > 0 ? dashboardData.vehicleStatus : dummyVehicleStatusData);
          setExpenseCategoryData(dashboardData.expenseCategories.length > 0 ? dashboardData.expenseCategories : dummyExpenseCategoryData);
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Unable to fetch dashboard data. Showing sample data.");
        
        // Keep dummy data as fallback
        setMonthlyFinancialData(dummyMonthlyData);
        setTripCountData(dummyTripCountData);
        setVehicleStatusData(dummyVehicleStatusData);
        setExpenseCategoryData(dummyExpenseCategoryData);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  // Function to refresh dashboard data
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentYear = new Date().getFullYear();
      
      const dashboardData = await DashboardService.refreshAllDashboardData(currentYear);
      
      setMonthlyFinancialData(dashboardData.monthlyFinancial.length > 0 ? dashboardData.monthlyFinancial : dummyMonthlyData);
      setTripCountData(dashboardData.monthlyTripCount.length > 0 ? dashboardData.monthlyTripCount : dummyTripCountData);
      setVehicleStatusData(dashboardData.vehicleStatus.length > 0 ? dashboardData.vehicleStatus : dummyVehicleStatusData);
      setExpenseCategoryData(dashboardData.expenseCategories.length > 0 ? dashboardData.expenseCategories : dummyExpenseCategoryData);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError("Failed to refresh dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <KiduLoader type="spinner" />
              <p className="mt-3 text-muted">Loading dashboard data...</p>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  // Define a constant for chart height for uniform look
  const CHART_HEIGHT = "280px"; 
  const CHART_MARGIN = { top: 10, right: 10, left: 10, bottom: 5 }; // Reduced margins

  // Custom Tick Formatter for YAxis to use smaller text
  const yAxisFormatter = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <div className="pt-2">
      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-warning py-2 d-flex justify-content-between align-items-center">
              <span>{error}</span>
              <button 
                className="btn btn-sm btn-outline-warning"
                onClick={refreshData}
                disabled={loading}
              >
                Retry
              </button>
            </div>
          </Col>
        </Row>
      )}

      <Row>
        {/* 1. Monthly Revenue vs. Expense Trend (Line Chart - Top Left) */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>💰 Financial Trend (Revenue vs. Expense)</h6>
            </Card.Header>
            <Card.Body className="p-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyFinancialData} margin={CHART_MARGIN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                  <YAxis tickFormatter={yAxisFormatter} style={{ fontSize: '0.75rem' }} />
                  <Tooltip 
                    contentStyle={{ fontSize: '0.8rem' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '5px' }} />
                  <Line
                    type="monotone"
                    dataKey="invoice"
                    name="Revenue"
                    stroke={SUCCESS_COLOR}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke={DANGER_COLOR}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* 2. Monthly Trip Count (Line Chart - Top Center) */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>🛣️ Monthly Trip Count</h6>
            </Card.Header>
            <Card.Body className="p-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tripCountData} margin={CHART_MARGIN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                  <YAxis style={{ fontSize: '0.75rem' }} />
                  <Tooltip contentStyle={{ fontSize: '0.8rem' }} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '5px' }} />
                  <Line
                    type="monotone"
                    dataKey="trips"
                    name="Total Trips"
                    stroke={WARNING_COLOR}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. Vehicle Status Distribution (Pie Chart - Top Right) */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>🚗 Vehicle Status Distribution</h6>
            </Card.Header>
            <Card.Body className="p-1 d-flex justify-content-center align-items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleStatusData as any}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75} // Reduced radius for compactness
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {vehicleStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '0.8rem' }} />
                  {/* Legend positioned at bottom for better flow */}
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '0.75rem', lineHeight: '18px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        {/* 4. Monthly Expense & Invoice Comparison (Bar Chart - Bottom Left) */}
        <Col xs={12} md={6} lg={6} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>📊 Monthly Financial Comparison</h6>
            </Card.Header>
            <Card.Body className="p-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFinancialData} margin={CHART_MARGIN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                  <YAxis tickFormatter={yAxisFormatter} style={{ fontSize: '0.75rem' }} />
                  <Tooltip 
                    contentStyle={{ fontSize: '0.8rem' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '5px' }} />
                  <Bar dataKey="expense" fill={DANGER_COLOR} name="Expense" />
                  <Bar dataKey="invoice" fill={SUCCESS_COLOR} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* 5. Top Expense Categories (Bar Chart - Bottom Right) */}
        <Col xs={12} md={6} lg={6} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>💸 Top 5 Expense Categories</h6>
            </Card.Header>
            <Card.Body className="p-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expenseCategoryData}
                  layout="vertical" // Use vertical layout for categories
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={yAxisFormatter} style={{ fontSize: '0.75rem' }} />
                  <YAxis dataKey="category" type="category" width={100} style={{ fontSize: '0.75rem' }} />
                  <Tooltip 
                    contentStyle={{ fontSize: '0.8rem' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="amount">
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Charts;