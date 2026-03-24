import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import API from "../services/api.auth";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    hire_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await API.get(`/employees/${id}`);
        const emp = res.data;
        setForm({
          name: emp?.name ?? "",
          email: emp?.email ?? "",
          phone: emp?.phone ?? "",
          position: emp?.position ?? "",
          salary: emp?.salary ?? "",
          hire_date: emp?.hire_date ?? "",
        });
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          (typeof err?.response?.data === "string" ? err.response.data : "") ||
          err?.message ||
          "Failed to load employee";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await API.put(`/employees/${id}`, {
        ...form,
        salary: form.salary === "" ? "" : Number(form.salary),
      });
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to update employee";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 4 }}>
        <CircularProgress size={32} />
        <Typography color="text.secondary">Loading employee…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Edit employee
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover">
          ← Back to list
        </Link>
      </Typography>

      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="Name" value={form.name} onChange={handleChange("name")} required fullWidth />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              fullWidth
            />
            <TextField label="Phone" value={form.phone} onChange={handleChange("phone")} required fullWidth />
            <TextField label="Position" value={form.position} onChange={handleChange("position")} required fullWidth />
            <TextField
              label="Salary"
              type="number"
              inputProps={{ step: "0.01", min: 0 }}
              value={form.salary}
              onChange={handleChange("salary")}
              required
              fullWidth
            />
            <TextField
              label="Hire date"
              type="date"
              value={form.hire_date}
              onChange={handleChange("hire_date")}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
              <Button component={RouterLink} to="/">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default EditEmployee;
