import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.auth";

function buildEmployeeFormData(form, profileFile) {
  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("phone", form.phone);
  formData.append("position", form.position);
  formData.append("salary", String(form.salary));
  formData.append("hire_date", form.hire_date);
  if (profileFile) {
    formData.append("profile_picture", profileFile);
  }
  return formData;
}

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
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setProfileFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = buildEmployeeFormData(form, profileFile);
      await API.post("/employees", formData);
      navigate("/");
    } catch (err) {
      const data = err?.response?.data;
      let message =
        data?.message ||
        (typeof data === "string" ? data : "") ||
        err?.message ||
        "Failed to add employee";
      if (data?.errors && typeof data.errors === "object") {
        const first = Object.values(data.errors).flat()[0];
        if (first) message = first;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Add Employee</h2>

      {error ? <div className="error-banner">{error}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field field-full">
          <label htmlFor="add-profile-picture">Profile picture (optional)</label>
          <input
            id="add-profile-picture"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
          />
          <p className="field-hint">JPEG, PNG, WebP, or GIF — max 2 MB</p>
          {previewUrl ? (
            <div className="profile-preview">
              <img src={previewUrl} alt="" />
            </div>
          ) : null}
        </div>

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
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            required
          />
        </div>

        <div className="field">
          <label>Phone</label>
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange("phone")}
            required
          />
        </div>

        <div className="field">
          <label>Position</label>
          <input
            placeholder="Position"
            value={form.position}
            onChange={handleChange("position")}
            required
          />
        </div>

        <div className="field">
          <label>Salary</label>
          <input
            placeholder="Salary"
            type="number"
            step="0.01"
            value={form.salary}
            onChange={handleChange("salary")}
            required
          />
        </div>

        <div className="field">
          <label>Hire date</label>
          <input
            placeholder="Hire date"
            type="date"
            value={form.hire_date}
            onChange={handleChange("hire_date")}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
