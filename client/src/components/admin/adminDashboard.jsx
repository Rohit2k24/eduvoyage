import React from 'react';
import './AdminDashboard.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// Sample data for charts
const userGrowthData = [
  { name: 'Jan', users: 300 },
  { name: 'Feb', users: 500 },
  { name: 'Mar', users: 450 },
  { name: 'Apr', users: 600 },
  { name: 'May', users: 700 },
  { name: 'Jun', users: 650 },
  { name: 'Jul', users: 800 },
  { name: 'Aug', users: 900 },
];

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
  { name: 'Aug', revenue: 5000 },
];

// Updated pieData for gender distribution
const genderData = [
  { name: 'Male', value: 60 },
  { name: 'Female', value: 40 },
];

const COLORS = ['#0088FE', '#FF8042']; // Male = Blue, Female = Orange

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin! Here's an overview of the latest metrics.</p>
      </div>

      {/* Overview Section */}
      <div className="dashboard-overview">
        <div className="card">
          <h3>Total Users</h3>
          <p>2,345</p>
        </div>
        <div className="card">
          <h3>Active Users</h3>
          <p>1,234</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p>$12,340</p>
        </div>
        <div className="card">
          <h3>New Sign-ups</h3>
          <p>150</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* User Growth Line Chart */}
        <div className="chart">
          <h2>User Growth (Last 8 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Growth Bar Chart */}
        <div className="chart">
          <h2>Revenue Growth (Last 8 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Student Gender Distribution */}
        <div className="chart">
          <h2>Student Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <table className="activity-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Signed Up</td>
              <td>2024-10-08</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Purchased a Product</td>
              <td>2024-10-07</td>
            </tr>
            <tr>
              <td>Robert Wilson</td>
              <td>Left a Review</td>
              <td>2024-10-06</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
