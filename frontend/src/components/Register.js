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
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div className="text-center mb-4">
          <h1 className="h3 mb-1">Create account</h1>
          <p className="text-secondary small mb-0">Register to access the employee dashboard.</p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-4">
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="reg-name" className="form-label">
                  Name
                </label>
                <input
                  id="reg-name"
                  className="form-control"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reg-email" className="form-label">
                  Email
                </label>
                <input
                  id="reg-email"
                  className="form-control"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reg-password" className="form-label">
                  Password
                </label>
                <input
                  id="reg-password"
                  className="form-control"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Choose a password"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Creating account…
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-secondary small mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="fw-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
