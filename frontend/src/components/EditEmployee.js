import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api.auth";
import { resolveProfilePictureSrc } from "../utils/profilePictureUrl";

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
  /** Fields needed to resolve stored photo URL against API origin (not React dev server). */
  const [existingPhotoMeta, setExistingPhotoMeta] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState(null);
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
        setExistingPhotoMeta({
          profile_picture_url: emp?.profile_picture_url ?? null,
          profile_picture: emp?.profile_picture ?? null,
          updated_at: emp?.updated_at ?? null,
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

  useEffect(() => {
    return () => {
      if (newPreviewUrl) {
        URL.revokeObjectURL(newPreviewUrl);
      }
    };
  }, [newPreviewUrl]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setProfileFile(file);
    if (newPreviewUrl) {
      URL.revokeObjectURL(newPreviewUrl);
    }
    setNewPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const formData = buildEmployeeFormData(form, profileFile);
      await API.post(`/employees/${id}`, formData);
      navigate("/");
    } catch (err) {
      const data = err?.response?.data;
      let message =
        data?.message ||
        (typeof data === "string" ? data : "") ||
        err?.message ||
        "Failed to update employee";
      if (data?.errors && typeof data.errors === "object") {
        const first = Object.values(data.errors).flat()[0];
        if (first) message = first;
      }
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading employee…</div>;
  }

  const existingResolved = resolveProfilePictureSrc(existingPhotoMeta, {
    cacheBust: true,
  });
  const displayPhoto = newPreviewUrl || existingResolved;

  return (
    <div className="form-card">
      <h2>Edit Employee</h2>

      {error ? <div className="error-banner">{error}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field field-full">
          <label htmlFor="edit-profile-picture">Profile picture</label>
          <input
            id="edit-profile-picture"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
          />
          <p className="field-hint">
            Leave empty to keep the current photo. JPEG, PNG, WebP, or GIF — max
            2 MB
          </p>
          {displayPhoto ? (
            <div className="profile-preview">
              <img
                src={displayPhoto}
                alt=""
                decoding="async"
              />
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

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;
