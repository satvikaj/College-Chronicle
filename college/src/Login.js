import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import "./Login.css";

const Login = ({ onLogin }) => {  // Receive onLogin as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login submitted with email:", email, "and password:", password);

    try {
      const response = await axiosInstance.post("/login", { email, password });

      console.log("Full response from backend:", response);
      const { role, redirectTo, email: userEmail } = response.data;

      console.log("Received email from backend:", userEmail);
      console.log("Role from backend:", role);

      // Call login function from props to store user details
      onLogin(userEmail, role);

      // Redirect based on role
      if (role === "coordinator") {
        console.log("Redirecting to coordinator dashboard...");
        navigate("/coordinatordashboard");
      } else if (role === "student") {
        console.log("Redirecting to student dashboard...");
        navigate("/studentdashboard");
      } else {
        console.log("Redirecting to:", redirectTo || "/");
        navigate(redirectTo || "/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid login credentials");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group password-input">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;