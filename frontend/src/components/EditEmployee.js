import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api.auth";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    hire_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await API.get(`/employees/${id}`);
        const emp = res.data;
        setForm({
          name: emp?.name ?? "",
          email: emp?.email ?? "",
          phone: emp?.phone ?? "",
          position: emp?.position ?? "",
          salary: emp?.salary ?? "",
          hire_date: emp?.hire_date ?? "",
        });
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          (typeof err?.response?.data === "string" ? err.response.data : "") ||
          err?.message ||
          "Failed to load employee";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await API.put(`/employees/${id}`, {
        ...form,
        salary: form.salary === "" ? "" : Number(form.salary),
      });
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to update employee";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-secondary py-5 justify-content-center">
        <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        <span>Loading employee…</span>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8 col-xl-6">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4">
          <h1 className="h3 mb-0">Edit employee</h1>
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
                  <label htmlFor="edit-name" className="form-label">
                    Name
                  </label>
                  <input
                    id="edit-name"
                    className="form-control"
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="edit-email"
                    className="form-control"
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-phone" className="form-label">
                    Phone
                  </label>
                  <input
                    id="edit-phone"
                    className="form-control"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-position" className="form-label">
                    Position
                  </label>
                  <input
                    id="edit-position"
                    className="form-control"
                    placeholder="Job title"
                    value={form.position}
                    onChange={handleChange("position")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="edit-salary" className="form-label">
                    Salary
                  </label>
                  <input
                    id="edit-salary"
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
                  <label htmlFor="edit-hire" className="form-label">
                    Hire date
                  </label>
                  <input
                    id="edit-hire"
                    className="form-control"
                    type="date"
                    value={form.hire_date}
                    onChange={handleChange("hire_date")}
                    required
                  />
                </div>
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
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

export default EditEmployee;
