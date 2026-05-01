import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      return setError("Please select a role first.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim(),
        password,
        role
      });

      const { token, role: userRole, user } = res.data;

      if (userRole !== role) {
        setError(`This account is registered as "${userRole}". Please select the correct role.`);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userName", user.name || "");

      clearFields();

      if (userRole === "student") {
        navigate("/test");
      } else if (userRole === "faculty") {
        navigate("/faculty-dashboard");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err.response || err);
      setError(err.response?.data?.message?.toString() || "Login failed");
    }
  };

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      return setError("Please select a role first.");
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      alert("Registration successful! You can now login.");
      clearFields();
      setShowSignup(false);

    } catch (err) {
      console.error("SIGNUP ERROR:", err.response || err);
      setError(err.response?.data?.message?.toString() || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="login-header">
          <h1>{showSignup ? "Create Account" : "Welcome Back"}</h1>
          <p>
            {showSignup
              ? "Register to access the mock test platform"
              : "Login to continue to your dashboard"}
          </p>
        </div>

        {/* Role Selection */}
        <div className="role-selection">
          <button
            type="button"
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "faculty" ? "active" : ""}
            onClick={() => setRole("faculty")}
          >
            Faculty
          </button>
        </div>

        {!showSignup ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-btn">
              Login
            </button>

            <p className="toggle-text">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => {
                  setShowSignup(true);
                  setError("");
                  setPassword("");
                }}
              >
                Sign Up
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-btn">
              Register
            </button>

            <p className="toggle-text">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setShowSignup(false);
                  setError("");
                  setPassword("");
                }}
              >
                Login
              </span>
            </p>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;