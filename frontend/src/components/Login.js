import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await API.post("/login", form);
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
        "Failed to login";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
        <div className="text-center mb-4">
          <h1 className="h3 mb-1">Sign in</h1>
          <p className="text-secondary small mb-0">Use your account to manage employees.</p>
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
                <label htmlFor="login-email" className="form-label">
                  Email
                </label>
                <input
                  id="login-email"
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
                <label htmlFor="login-password" className="form-label">
                  Password
                </label>
                <input
                  id="login-password"
                  className="form-control"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
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
                    Signing in…
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-secondary small mt-3 mb-0">
          No account?{" "}
          <Link to="/register" className="fw-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
