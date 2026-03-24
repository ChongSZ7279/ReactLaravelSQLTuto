import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api.auth";

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Signing you out…");
  const [working, setWorking] = useState(true);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await API.post("/logout");
      } catch (err) {
        // Still clear local storage if the request fails.
      } finally {
        window.localStorage.removeItem("auth_token");
        window.localStorage.removeItem("auth_user");
        setWorking(false);
        setMessage("You have been signed out.");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 800);
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6 text-center py-5">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            {working ? (
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                aria-label="Loading"
              />
            ) : null}
            <h1 className="h4 mb-2">Logout</h1>
            <p className="text-secondary mb-0">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logout;
