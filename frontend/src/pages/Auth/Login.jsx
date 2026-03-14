import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.access_token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Dark overlay for better readability */}
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#2F855A" }}>
          🌱 Welcome Back
        </h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#2F855A", fontWeight: "bold" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/greg.jpeg')", // Your background image path
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)", // Dark overlay for readability
  },
  card: {
    position: "relative",
    zIndex: 10,
    padding: "40px",
    width: "360px",
    backgroundColor: "rgba(255,255,255,0.95)", // Slight transparency
    borderRadius: "15px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "25px",
  },
  input: {
    padding: "12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #CBD5E0",
    outline: "none",
  },
  button: {
    padding: "12px",
    backgroundColor: "#2F855A",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "10px",
    fontSize: "16px",
    transition: "background 0.3s",
  },
};

export default Login;