import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Advertisement from "./components/Home/Advertisement";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import StudentDashboard from "./components/student/studentDashboard";

function App() {
  return (
    <Router>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ad" element={<Advertisement />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
