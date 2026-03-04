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
      <h2>Employees</h2>

      {error ? (
        <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>
      ) : null}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {employees.map((emp) => (
            <li key={emp.id} style={{ marginBottom: 8 }}>
              <strong>{emp.name}</strong> — {emp.position}{" "}
              <Link to={`/edit/${emp.id}`} style={{ marginLeft: 8 }}>
                Edit
              </Link>
              <button
                onClick={() => handleDelete(emp.id)}
                style={{ marginLeft: 8 }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeeList;