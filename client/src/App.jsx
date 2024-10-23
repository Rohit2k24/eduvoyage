import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Advertisement from "./components/Home/Advertisement";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css"; 
import StudentDashboard from "./components/student/studentDashboard";
import CollegeAdmin from "./components/collegeAdmin/collegeadminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./components/Admin/adminDashboard";
import RegisterRedirect from "./components/RegisterForm/RegisterRedirect";
import CollegeRegistrationForm from "./components/RegisterForm/CollegeRegistrationForm";
import PrivateRoutes from "./utils/PrivateRoutes";
import CollegesList from "./components/Admin/CollegesList";
import ApproveColleges from "./components/Admin/ApproveColleges";
import ManageCourses from "./components/Admin/ManageCourses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ad" element={<Advertisement />} />
        <Route path="/register-redirect" element={<RegisterRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/college-register" element={<CollegeRegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studentDashboard" element={<PrivateRoutes><StudentDashboard /></PrivateRoutes>}/>
        <Route path="/adminDashboard" element={<PrivateRoutes><AdminDashboard/></PrivateRoutes>} />
        <Route path="/collegeadminDashboard" element={<PrivateRoutes><CollegeAdmin/></PrivateRoutes>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/admin/colleges" element={<CollegesList/>}/>
        <Route path="/admin/approve-colleges" element={<ApproveColleges/>}/>
        <Route path="/admin/manage-courses" element={<ManageCourses/>}/>
      </Routes>
    </Router>
  );
}

export default App;
