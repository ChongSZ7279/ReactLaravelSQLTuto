import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import API from "../services/api.auth";

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Signing you out…");

  useEffect(() => {
    const doLogout = async () => {
      try {
        await API.post("/logout");
      } catch (err) {
        // Still clear storage if request fails
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
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 4, textAlign: "center" }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Logout
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Paper>
    </Box>
  );
}

export default Logout;
