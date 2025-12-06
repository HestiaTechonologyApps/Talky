import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import {Bar,BarChart,CartesianGrid,Legend,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis,PieChart,Pie,Cell,} from "recharts";
import KiduLoader from "../components/KiduLoader";

// Type definitions
interface MonthlyData {
  month: string;
  revenue: number;
  expense: number;
}

interface CallCountData {
  month: string;
  calls: number;
}

interface StaffStatusData {
  name: string;
  value: number;
  color: string;
}

interface CallCategoryData {
  category: string;
  amount: number;
  fill: string;
}

// Color Palette for a modern look
const PRIMARY_COLOR = "#882626ff"; // Brand color
const SUCCESS_COLOR = "#28a745"; // Green for revenue/available
const DANGER_COLOR = "#dc3545"; // Red for busy/high usage
const WARNING_COLOR = "#ffc107"; // Yellow for calls/utilization

// 1. Financial/Monthly Data
const dummyMonthlyData: MonthlyData[] = [
  { month: "Jan", revenue: 45000, expense: 25000 },
  { month: "Feb", revenue: 52000, expense: 28000 },
  { month: "Mar", revenue: 58000, expense: 30000 },
  { month: "Apr", revenue: 55000, expense: 29000 },
  { month: "May", revenue: 62000, expense: 32000 },
  { month: "Jun", revenue: 68000, expense: 35000 },
  { month: "Jul", revenue: 72000, expense: 36000 },
  { month: "Aug", revenue: 69000, expense: 34000 },
  { month: "Sep", revenue: 63000, expense: 31000 },
  { month: "Oct", revenue: 66000, expense: 33000 },
  { month: "Nov", revenue: 75000, expense: 38000 },
  { month: "Dec", revenue: 82000, expense: 40000 },
];

// 2. Monthly Call Count Data
const dummyCallCountData: CallCountData[] = [
  { month: "Jan", calls: 850 },
  { month: "Feb", calls: 920 },
  { month: "Mar", calls: 1050 },
  { month: "Apr", calls: 980 },
  { month: "May", calls: 1150 },
  { month: "Jun", calls: 1220 },
  { month: "Jul", calls: 1350 },
  { month: "Aug", calls: 1280 },
  { month: "Sep", calls: 1100 },
  { month: "Oct", calls: 1180 },
  { month: "Nov", calls: 1420 },
  { month: "Dec", calls: 1550 },
];

// 3. Staff Status Data (Pie Chart)
const dummyStaffStatusData: StaffStatusData[] = [
  { name: "On Call", value: 12, color: DANGER_COLOR },
  { name: "Available", value: 35, color: SUCCESS_COLOR },
  { name: "Offline", value: 8, color: "#6c757d" },
  { name: "Break", value: 5, color: WARNING_COLOR },
];

// 4. Top Call Categories Data (Bar Chart)
const dummyCallCategoryData: CallCategoryData[] = [
  { category: "Video Calls", amount: 15000, fill: PRIMARY_COLOR },
  { category: "Audio Calls", amount: 12000, fill: SUCCESS_COLOR },
  { category: "Customer Support", amount: 8000, fill: WARNING_COLOR },
  { category: "Consultations", amount: 6500, fill: "#17a2b8" },
  { category: "Training", amount: 4000, fill: "#6c757d" },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
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
            style={{ fontSize: '10px' }}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Charts: React.FC = () => {
  // State for all chart data - using dummy data directly
  const [monthlyFinancialData] = useState<MonthlyData[]>(dummyMonthlyData);
  const [callCountData] = useState<CallCountData[]>(dummyCallCountData);
  const [staffStatusData] = useState<StaffStatusData[]>(dummyStaffStatusData);
  const [callCategoryData] = useState<CallCategoryData[]>(dummyCallCategoryData);
  
  // Loading state (set to false since we're using static data)
  const [loading] = useState<boolean>(false);

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

  const CHART_HEIGHT = "280px"; 
  const CHART_MARGIN = { top: 10, right: 10, left: 10, bottom: 5 };

  const yAxisFormatter = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

  return (
    <div className="pt-2">
      <Row>
        {/* 1. Monthly Revenue vs. Expense Trend (Line Chart) */}
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
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '5px' }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
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

        {/* 2. Monthly Call Count (Line Chart) */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>📞 Monthly Call Count</h6>
            </Card.Header>
            <Card.Body className="p-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={callCountData} margin={CHART_MARGIN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                  <YAxis style={{ fontSize: '0.75rem' }} />
                  <Tooltip contentStyle={{ fontSize: '0.8rem' }} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '5px' }} />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    name="Total Calls"
                    stroke={PRIMARY_COLOR}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* 3. Staff Status Distribution (Pie Chart) */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>👥 Staff Status Distribution</h6>
            </Card.Header>
            <Card.Body className="p-1 d-flex justify-content-center align-items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={staffStatusData as any}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {staffStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '0.8rem' }} />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '0.75rem', lineHeight: '18px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        {/* 4. Monthly Revenue & Expense Comparison (Bar Chart) */}
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
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '5px' }} />
                  <Bar dataKey="revenue" fill={SUCCESS_COLOR} name="Revenue" />
                  <Bar dataKey="expense" fill={DANGER_COLOR} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* 5. Top Call Categories (Bar Chart) */}
        <Col xs={12} md={6} lg={6} className="mb-4">
          <Card className="shadow-sm border-0" style={{ height: CHART_HEIGHT }}>
            <Card.Header className="bg-light p-3 border-bottom">
              <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>📱 Top 5 Call Categories</h6>
            </Card.Header>
            <Card.Body className="p-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={callCategoryData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={yAxisFormatter} style={{ fontSize: '0.75rem' }} />
                  <YAxis dataKey="category" type="category" width={120} style={{ fontSize: '0.75rem' }} />
                  <Tooltip 
                    contentStyle={{ fontSize: '0.8rem' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="amount">
                    {callCategoryData.map((entry, index) => (
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