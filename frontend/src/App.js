import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Employee Management System</h1>

        {/* Navigation */}
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/add">Add Employee</Link>
        </nav>

        <hr />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/edit/:id" element={<EditEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;