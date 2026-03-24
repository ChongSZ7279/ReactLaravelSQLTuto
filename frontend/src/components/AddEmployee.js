import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api.auth";

function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    hire_date: "",
  });
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
      await API.post("/employees", {
        ...form,
        salary: form.salary === "" ? "" : Number(form.salary),
      });
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to add employee";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8 col-xl-6">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4">
          <h1 className="h3 mb-0">Add employee</h1>
          <Link to="/" className="btn btn-outline-secondary btn-sm">
            Cancel
          </Link>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <div className="card shadow-sm">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="add-name" className="form-label">
                    Name
                  </label>
                  <input
                    id="add-name"
                    className="form-control"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="add-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="add-email"
                    className="form-control"
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="add-phone" className="form-label">
                    Phone
                  </label>
                  <input
                    id="add-phone"
                    className="form-control"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="add-position" className="form-label">
                    Position
                  </label>
                  <input
                    id="add-position"
                    className="form-control"
                    placeholder="Job title"
                    value={form.position}
                    onChange={handleChange("position")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="add-salary" className="form-label">
                    Salary
                  </label>
                  <input
                    id="add-salary"
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={form.salary}
                    onChange={handleChange("salary")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="add-hire" className="form-label">
                    Hire date
                  </label>
                  <input
                    id="add-hire"
                    className="form-control"
                    type="date"
                    value={form.hire_date}
                    onChange={handleChange("hire_date")}
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Saving…
                    </>
                  ) : (
                    "Save employee"
                  )}
                </button>
                <Link to="/" className="btn btn-outline-secondary">
                  Back to list
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
