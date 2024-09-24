import React from 'react';
import './StudentDashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const data = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 4 },
  { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 5 },
  { day: 'Fri', hours: 1 },
  { day: 'Sat', hours: 6 },
  { day: 'Sun', hours: 4 },
];

const StudentDashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Eduvoyage</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Study Programs</li>
          <li>Resources</li>
          <li>Tasks</li>
          <li>Exams</li>
          <li>Analytics</li>
          <li>Groups</li>
          <li>Messages</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <input type="text" placeholder="Search programs, courses..." />
          <div className="user-profile">
            <span>Rohit</span>
            <img src="https://via.placeholder.com/40" alt="Profile" />
          </div>
        </header>

        <section className="dashboard">
          <div className="cards">
            <div className="card purple">
              <h3>Study Materials</h3>
              <p>200 Files</p>
            </div>
            <div className="card green">
              <h3>Photos</h3>
              <p>320 Files</p>
            </div>
            <div className="card pink">
              <h3>Videos</h3>
              <p>50 GB</p>
            </div>
          </div>

          <div className="content-row">
            <div className="class-schedule">
              <h3>Upcoming Classes</h3>
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Room</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>International Relations</td>
                    <td>B-201</td>
                    <td>10 Oct</td>
                    <td>09:30 AM</td>
                  </tr>
                  <tr>
                    <td>Global Economics</td>
                    <td>C-101</td>
                    <td>12 Oct</td>
                    <td>11:00 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="hours-spent">
              <h3>Study Hours</h3>
              <div className="chart">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="content-row">
            <div className="message-section">
              <h3>Messages</h3>
              <ul>
                <li>Maria Fernandez</li>
                <li>Alex Johnson</li>
                <li>Li Wei</li>
              </ul>
            </div>
            <div className="notice-board">
              <h3>Notice Board</h3>
              <ul>
                <li>Visa Processing Reminder</li>
                <li>Scholarship Application Deadline</li>
                <li>Semester Fees Due by 20 Oct</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
