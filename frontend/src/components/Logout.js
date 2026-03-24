import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.auth";

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Signing you out…");

  useEffect(() => {
    const doLogout = async () => {
      try {
        await API.post("/logout");
      } catch (err) {
        // Still clear local storage if the request fails.
      } finally {
        window.localStorage.removeItem("auth_token");
        window.localStorage.removeItem("auth_user");
        setMessage("You have been signed out.");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 800);
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <svg
            className="h-6 w-6 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Logout</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}

export default Logout;
