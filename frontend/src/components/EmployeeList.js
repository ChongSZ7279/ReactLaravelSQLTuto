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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <h1 className="h3 mb-0">Employees</h1>
        <Link to="/add" className="btn btn-primary">
          Add employee
        </Link>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="d-flex align-items-center gap-2 text-secondary py-5 justify-content-center">
          <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span>Loading employees…</span>
        </div>
      ) : employees.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-secondary mb-3">No employees yet.</p>
            <Link to="/add" className="btn btn-primary">
              Add your first employee
            </Link>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Position</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="fw-medium">{emp.name}</td>
                    <td className="text-secondary small">{emp.email}</td>
                    <td>{emp.position}</td>
                    <td className="text-end text-nowrap">
                      <Link to={`/edit/${emp.id}`} className="btn btn-sm btn-outline-primary me-2">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
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
