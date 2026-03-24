import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
} from "react-router-dom";

import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";

function RequireAuth({ children }) {
  const token = window.localStorage.getItem("auth_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function navLinkClass({ isActive }) {
  return `nav-link ${isActive ? "active" : ""}`;
}

function App() {
  const token = window.localStorage.getItem("auth_token");

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">
            Employee Manager
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className={navLinkClass} end to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/add">
                  Add Employee
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {token ? (
                <li className="nav-item">
                  <NavLink className={navLinkClass} to="/logout">
                    Logout
                  </NavLink>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className={navLinkClass} to="/login">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={navLinkClass} to="/register">
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">
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
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
