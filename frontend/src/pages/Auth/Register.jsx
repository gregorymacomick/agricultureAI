import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import toast from "react-hot-toast";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await api.post("api/auth/register", formData);

      toast.success("Registration successful!");

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.error || "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister} style={styles.form}>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4"
  },
  card: {
    padding: "40px",
    width: "320px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px"
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#4CAF50",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "5px"
  }
};

export default Register;