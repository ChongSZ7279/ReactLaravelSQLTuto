import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
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

function App() {
  const token = window.localStorage.getItem("auth_token");

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Employee Management System</h1>

        <nav>
          <Link to="/">Home</Link> | <Link to="/add">Add Employee</Link> |{" "}
          {token ? (
            <Link to="/logout">Logout</Link>
          ) : (
            <>
              <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </>
          )}
        </nav>

        <hr />

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
      </div>
    </Router>
  );
}

export default App;

