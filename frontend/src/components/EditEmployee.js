import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Employee</h2>

      {error ? (
        <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={handleChange("name")}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange("phone")}
          required
        />
        <input
          placeholder="Position"
          value={form.position}
          onChange={handleChange("position")}
          required
        />
        <input
          placeholder="Salary"
          type="number"
          step="0.01"
          value={form.salary}
          onChange={handleChange("salary")}
          required
        />
        <input
          placeholder="Hire date"
          type="date"
          value={form.hire_date}
          onChange={handleChange("hire_date")}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;

