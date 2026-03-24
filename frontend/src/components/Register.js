import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

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
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create account</h2>
        <p className="mt-1 text-sm text-slate-500">
          Register to manage employees.
        </p>

        {error ? (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="register-name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Name
            </label>
            <input
              id="register-name"
              autoComplete="name"
              className={inputClass}
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange("name")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>
          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
