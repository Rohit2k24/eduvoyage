import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Advertisement from "./components/Home/Advertisement";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css"; 
import StudentDashboard from "./components/student/StudentDashboard";
import CollegeAdmin from "./components/collegeAdmin/CollegeAdminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./components/Admin/AdminDashboard";
import RegisterRedirect from "./components/RegisterForm/RegisterRedirect";
import CollegeRegistrationForm from "./components/RegisterForm/CollegeRegistrationForm";
import PrivateRoutes from "./utils/PrivateRoutes";
import CollegesList from "./components/Admin/CollegesList";
import ApproveColleges from "./components/Admin/ApproveColleges";
import ManageCourses from "./components/Admin/ManageCourses";
import DisabledCourses from "./components/Admin/DisabledCourses";
import ManageUsers from "./components/Admin/ManageUsers";
import Reports from "./components/Admin/Reports";
import ExamsAndCertifications from './components/collegeAdmin/ExamsAndCertifications';
import PublicQueries from './components/collegeAdmin/PublicQueries';
import CourseOffered from "./components/collegeAdmin/CourseOffered";
import StudyProgram from "./components/student/StudyProgram";
import ApplicationRecieved from "./components/collegeAdmin/ApplicationsRecieved";
import ApprovedApplications from "./components/collegeAdmin/ApprovedApplications";
import Resources from "./components/student/Resources";
import Tasks from "./components/student/Tasks";
import Exams from "./components/student/Exams";
import Analytics from "./components/student/Analytics";
import Groups from "./components/student/Groups";
import Messages from "./components/student/Messages";
import CollegeDetails from "./components/student/CollegeDetails";
import AvailableCourses from "./components/student/AvailableCourses";
import HelpSupport from "./components/student/HelpSupport";
import ScholarshipPrograms from "./components/student/ScholarshipPrograms";

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
        <Route path="/studentDashboard" element={<PrivateRoutes><StudentDashboard /></PrivateRoutes>} />
        <Route path="/studentDashboard/study-program" element={<PrivateRoutes><StudyProgram /></PrivateRoutes>} />
        <Route path="/studentDashboard/college-details" element={<PrivateRoutes><CollegeDetails /></PrivateRoutes>} />
        <Route path="/studentDashboard/available-courses" element={<PrivateRoutes><AvailableCourses /></PrivateRoutes>} />
        <Route path="/studentDashboard/help-support" element={<PrivateRoutes><HelpSupport /></PrivateRoutes>} />
        <Route path="/studentDashboard/scholarships" element={<PrivateRoutes><ScholarshipPrograms /></PrivateRoutes>} />
        <Route path="/adminDashboard" element={<PrivateRoutes><AdminDashboard /></PrivateRoutes>} />
        <Route path="/collegeadminDashboard" element={<PrivateRoutes><CollegeAdmin /></PrivateRoutes>} />
        <Route path="/forgot-password" element={<PrivateRoutes><ForgotPassword /></PrivateRoutes>} />
        <Route path="/admin/colleges" element={<PrivateRoutes><CollegesList /></PrivateRoutes>} />
        <Route path="/admin/approve-colleges" element={<PrivateRoutes><ApproveColleges /></PrivateRoutes>} />
        <Route path="/admin/manage-courses" element={<PrivateRoutes><ManageCourses /></PrivateRoutes>} />
        <Route path="/deleted-courses" element={<PrivateRoutes><DisabledCourses /></PrivateRoutes>} />
        <Route path="/admin/manage-users" element={<PrivateRoutes><ManageUsers /></PrivateRoutes>} />
        <Route path="/admin/reports" element={<PrivateRoutes><Reports /></PrivateRoutes>} />
        <Route path="/course-offered" element={<PrivateRoutes><CourseOffered /></PrivateRoutes>} />
        <Route path="/exams-certifications" element={<PrivateRoutes><ExamsAndCertifications /></PrivateRoutes>} />
        <Route path="/application-recieved" element={<PrivateRoutes><ApplicationRecieved /></PrivateRoutes>} />
        <Route path="/public-queries" element={<PrivateRoutes><PublicQueries /></PrivateRoutes>} />
        <Route path="/study-program" element={<PrivateRoutes><StudyProgram /></PrivateRoutes>} />
        <Route path="/approved-application" element={<PrivateRoutes><ApprovedApplications /></PrivateRoutes>} />
        <Route path="/resources" element={<PrivateRoutes><Resources /></PrivateRoutes>} />
        <Route path="/tasks" element={<PrivateRoutes><Tasks /></PrivateRoutes>} />
        <Route path="/exams" element={<PrivateRoutes><Exams /></PrivateRoutes>} />
        <Route path="/analytics" element={<PrivateRoutes><Analytics /></PrivateRoutes>} />
        <Route path="/groups" element={<PrivateRoutes><Groups /></PrivateRoutes>} />
        <Route path="/messages" element={<PrivateRoutes><Messages /></PrivateRoutes>} />
      </Routes>
    </Router>
  );
}

export default App;
