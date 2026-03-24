import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api.auth";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const labelClass = "mb-1 block text-sm font-medium text-slate-700";

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
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 shadow-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
            aria-hidden
          />
          <span className="text-sm font-medium">Loading employee…</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back to list
        </Link>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">
          Edit employee
        </h2>
        <p className="text-sm text-slate-500">
          Update the fields and save your changes.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {error ? (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="edit-name" className={labelClass}>
              Name
            </label>
            <input
              id="edit-name"
              className={inputClass}
              placeholder="Full name"
              value={form.name}
              onChange={handleChange("name")}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-email" className={labelClass}>
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              className={inputClass}
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="edit-phone"
              className={inputClass}
              placeholder="+1 555 000 0000"
              value={form.phone}
              onChange={handleChange("phone")}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="edit-position" className={labelClass}>
              Position
            </label>
            <input
              id="edit-position"
              className={inputClass}
              placeholder="Job title"
              value={form.position}
              onChange={handleChange("position")}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-salary" className={labelClass}>
              Salary
            </label>
            <input
              id="edit-salary"
              type="number"
              step="0.01"
              className={inputClass}
              placeholder="0.00"
              value={form.salary}
              onChange={handleChange("salary")}
              required
            />
          </div>
          <div>
            <label htmlFor="edit-hire" className={labelClass}>
              Hire date
            </label>
            <input
              id="edit-hire"
              type="date"
              className={inputClass}
              value={form.hire_date}
              onChange={handleChange("hire_date")}
              required
            />
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;
