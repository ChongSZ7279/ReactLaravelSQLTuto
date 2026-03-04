import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";

import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";
import Login from "./components/Login";
import Register from "./components/Register";

function RequireAuth({ children }) {
  const token = window.localStorage.getItem("auth_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const token = window.localStorage.getItem("auth_token");
  let userName = "";
  const rawUser = window.localStorage.getItem("auth_user");
  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser);
      userName = parsed?.name || "";
    } catch {
      userName = "";
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("auth_token");
    window.localStorage.removeItem("auth_user");
    window.location.href = "/login";
  };
  return (
    <Router>
      <div className="page">
        <div className="top-bar">
          <h2>Employee Management</h2>
          <nav>
            <Link to="/" className="btn-ghost">
              Home
            </Link>
            <Link to="/add" className="btn-primary">
              Add Employee
            </Link>
            {token ? (
              <>
                {userName ? (
                  <span className="nav-user">Hi, {userName}</span>
                ) : null}
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-ghost">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <EmployeeList />
              </RequireAuth>
            }
          />
          <Route
            path="/add"
            element={
              <RequireAuth>
                <AddEmployee />
              </RequireAuth>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <RequireAuth>
                <EditEmployee />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

