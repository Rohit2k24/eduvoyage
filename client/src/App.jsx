import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header"; // Ensure Header is imported correctly
import Home from "./components/Home/Home";
import Advertisement from "./components/Home/Advertisement";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css"; // Import your main styles
import StudentDashboard from "./components/student/studentDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard"; // Import AdminDashboard from correct path
import CollegeAdmin from "./components/collegeAdmin/collegeadminDashboard";

function App() {
  return (
    <Router>
      {/* This will make sure the header is visible across all pages */}
     

      <Routes>
        {/* Define all your routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/ad" element={<Advertisement />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard/>} />
        <Route path="/collegeadminDashboard" element={<CollegeAdmin/>} />
      </Routes>
    </Router>
  );
}

export default App;
