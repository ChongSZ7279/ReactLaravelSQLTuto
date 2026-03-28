import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api.auth";
import { resolveProfilePictureSrc } from "../utils/profilePictureUrl";

function EmployeeAvatar({ name, url }) {
  const initial = (name && name.trim()[0]) || "?";
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [url]);

  if (url && !broken) {
    return (
      <img
        className="employee-avatar-img"
        src={url}
        alt=""
        loading="lazy"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <span className="employee-avatar-fallback is-visible" aria-hidden>
      {initial.toUpperCase()}
    </span>
  );
}

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
      {error ? <div className="error-banner">{error}</div> : null}

      {loading ? (
        <div className="loading">Loading employees…</div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          No employees yet. Click “Add Employee” to create your first one.
        </div>
      ) : (
        <ul className="employee-list">
          {employees.map((emp) => {
            const photoSrc = resolveProfilePictureSrc(emp, { cacheBust: true });
            return (
            <li key={emp.id} className="employee-item">
              <div className="employee-main">
                <div className="employee-avatar">
                  <span className="employee-avatar-inner" aria-hidden>
                    <EmployeeAvatar name={emp.name} url={photoSrc} />
                  </span>
                </div>
                <div className="employee-info">
                  <span className="employee-name">{emp.name}</span>
                  <span className="employee-position">{emp.position}</span>
                </div>
              </div>
              <div className="employee-actions">
                <Link to={`/edit/${emp.id}`} className="btn-ghost">
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default EmployeeList;
