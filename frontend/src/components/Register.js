import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await API.post("/register", form);
      const { token, user } = res.data || {};

      if (token) {
        window.localStorage.setItem("auth_token", token);
      }
      if (user) {
        window.localStorage.setItem("auth_user", JSON.stringify(user));
      }

      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to register";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Register</h2>

      {error ? <div className="error-banner">{error}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field">
          <label>Name</label>
          <input
            placeholder="Name"
            value={form.name}
            onChange={handleChange("name")}
            required
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange("email")}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange("password")}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;

