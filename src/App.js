import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import StudentDashboard from "./studentdashboard";
import CoordinatorDashboard from "./coordinatordashboard";
import StudentProfile from "./studentprofile";
import CoordinatorProfile from "./coordinatorprofile";
import Home from "./Home";
import DashboardContent from "./Dashboardcontent";
import Postspage from "./Postspage";
import Newpost from "./Newpost";
import Header from "./Header";
import DraftsPage from "./DraftsPage";  // Import DraftsPage
import RMFPage from "./RMFpage";  // Import RMFPage

const App = () => {
  const [user, setUser] = useState(null); // User state
  const navigate = useNavigate();
  const location = useLocation();

  // Exclude Header for these routes
  const excludeHeaderRoutes = ["/", "/login"].map((route) => route.toLowerCase());

  const handleLogin = (email) => {
    if (email === "user1@example.com") {
      setUser("student");
      navigate("/studentdashboard");
    } else if (email === "user2@example.com") {
      setUser("coordinator");
      navigate("/coordinatordashboard");
    }
  };

  return (
    <>
      {user && !excludeHeaderRoutes.includes(location.pathname.toLowerCase()) && <Header user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/coordinatordashboard" element={<CoordinatorDashboard />} />
        <Route path="/profile/student" element={<StudentProfile />} />
        <Route path="/profile/coordinator" element={<CoordinatorProfile />} />
        <Route path="/dashboardcontent" element={<DashboardContent />} />
        <Route path="/postspage" element={<Postspage />} />
        <Route path="/newpost" element={<Newpost />} />
        <Route path="/draftspage" element={<DraftsPage />} />
        <Route path="/rmfpage" element={<RMFPage />} />  {/* Ensure this path is correct */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
