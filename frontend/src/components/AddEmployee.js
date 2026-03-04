import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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
    <div>
      <h2>Add Employee</h2>

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

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;