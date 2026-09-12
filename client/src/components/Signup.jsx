import { useState } from "react";
import { signupUser } from "../services/api";

function Signup({ onSignup, onBackToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    inspectorId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.inspectorId ||
      !form.password
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await signupUser(form);

      onSignup(data.user);
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <div className="auth-brand-panel">
          <div className="brand-mark large">M</div>

          <div className="eyebrow">
            JOIN THE INSPECTION CONSOLE
          </div>

          <h1>
            Build a
            <br />
            verifiable trail.
          </h1>

          <p>
            Create your METRALENS inspector account and manage
            packaged commodity inspections from one secure console.
          </p>
        </div>

        <div className="auth-card signup-card">
          <div className="auth-heading">
            <span>INSPECTOR REGISTRATION</span>
            <h2>Create account.</h2>
            <p>Enter your professional details to get started.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
            />

            <label>Inspector ID</label>
            <input
              type="text"
              placeholder="e.g. INS-001"
              value={form.inspectorId}
              onChange={(e) =>
                updateField("inspectorId", e.target.value)
              }
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
            />

            {error && <div className="error-message">{error}</div>}

            <button className="auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <button
            className="signup-link"
            onClick={onBackToLogin}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;