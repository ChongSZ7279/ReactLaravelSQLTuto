import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.auth";

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Logging you out...");

  useEffect(() => {
    const doLogout = async () => {
      try {
        // Call backend logout (will invalidate token server-side)
        await API.post("/logout");
      } catch (err) {
        // Even if the request fails (e.g., token already invalid),
        // we'll still clear local storage below.
      } finally {
        window.localStorage.removeItem("auth_token");
        window.localStorage.removeItem("auth_user");
        setMessage("You have been logged out.");

        // Small delay so the user can see the message
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 800);
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div>
      <h2>Logout</h2>
      <p>{message}</p>
    </div>
  );
}

export default Logout;

