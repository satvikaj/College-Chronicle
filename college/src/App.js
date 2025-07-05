import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import DraftsPage from "./DraftsPage";

const App = () => {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");

    if (storedEmail) setUserEmail(storedEmail);
    if (storedRole) setUserRole(storedRole);
  }, []);

  const login = (email, role) => {
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
  };

  const logout = () => {
    setUserEmail(null);
    setUserRole(null);
    localStorage.clear();
  };

  const excludeHeaderRoutes = ["/", "/login"];
  const shouldShowHeader = !excludeHeaderRoutes.includes(location.pathname.toLowerCase());

  // Dynamically update body class
  useEffect(() => {
    if (shouldShowHeader) {
      document.body.classList.add("with-header");
    } else {
      document.body.classList.remove("with-header");
    }
  }, [shouldShowHeader]);

  return (
    <>
      {shouldShowHeader && <Header userRole={userRole} onLogout={logout} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/coordinatordashboard" element={<CoordinatorDashboard />} />
        <Route path="/profile/student" element={<StudentProfile userEmail={userEmail} />} />
        <Route path="/profile/coordinator" element={<CoordinatorProfile userEmail={userEmail} />} />
        <Route path="/dashboardcontent" element={<DashboardContent />} />
        <Route path="/postspage" element={<Postspage userEmail={userEmail} />} />
        <Route path="/newpost" element={<Newpost userEmail={userEmail} />} />
        <Route path="/draftspage" element={<DraftsPage />} />
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