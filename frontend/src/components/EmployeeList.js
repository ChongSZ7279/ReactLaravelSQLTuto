import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api.auth";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await API.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          (typeof err?.response?.data === "string" ? err.response.data : "") ||
          err?.message ||
          "Failed to load employees";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const refresh = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to load employees";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this employee?");
    if (!ok) return;

    setError("");
    try {
      await API.delete(`/employees/${id}`);
      await refresh();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to delete employee";
      setError(message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Employees</h2>
          <p className="text-sm text-slate-500">
            View, edit, or remove records from the directory.
          </p>
        </div>
        <Link
          to="/add"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add employee
        </Link>
      </div>

      {error ? (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
              aria-hidden
            />
            <span className="text-sm font-medium">Loading employees…</span>
          </div>
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-900">No employees yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Add your first employee to get started.
          </p>
          <Link
            to="/add"
            className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Add employee →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="hidden px-4 py-3 font-semibold text-slate-700 sm:table-cell">
                    Position
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {emp.name}
                      </div>
                      <div className="text-slate-500 sm:hidden">
                        {emp.position}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                      {emp.position}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-2">
                        <Link
                          to={`/edit/${emp.id}`}
                          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(emp.id)}
                          className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
