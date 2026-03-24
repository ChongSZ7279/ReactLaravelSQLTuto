import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-indigo-100 text-indigo-800"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Employee Management
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                React + Laravel API
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/add" className={navLinkClass}>
                Add employee
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">
          <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/add" element={<AddEmployee />} />
            <Route path="/edit/:id" element={<EditEmployee />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
