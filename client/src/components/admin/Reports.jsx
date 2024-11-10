import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar
import './Reports.css'; // You can create a separate CSS for styling


const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
      localStorage.removeItem('token');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

const Reports = () => {
  const [reports, setReports] = useState([]);

useEffect(() => {
    // Fetch reports or analytics data
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/reports`);
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="layout">
      <Sidebar handleLogout={handleLogout}/>
      <div className="reports">
        <h1>Reports</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Date Generated</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td>{report.title}</td>
                <td>{new Date(report.dateGenerated).toLocaleDateString()}</td>
                <td>{report.status}</td>
                <td>
                  {/* Add action buttons like View, Download */}
                  <button className="btn btn-info">View</button>
                  <button className="btn btn-success">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Reports;
