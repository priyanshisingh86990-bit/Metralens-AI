import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin, onSignup, onBack }) {
  const [name, setName] = useState("");
  const [inspectorId, setInspectorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !inspectorId.trim()) {
      setError("Please enter your name and Inspector ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({
        name: name.trim(),
        inspectorId: inspectorId.trim(),
        role: "INSPECTOR",
      });

      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="back-button" onClick={onBack}>
        ← Back to METRALENS
      </button>

      <div className="auth-layout">
        <div className="auth-brand-panel">
          <div className="brand-mark large">M</div>

          <div className="eyebrow">
            INSPECTION INTELLIGENCE PLATFORM
          </div>

          <h1>
            Verify every
            <br />
            declaration.
          </h1>

          <p>
            Access the METRALENS inspection console for AI-assisted
            packaged commodity compliance verification.
          </p>

          <div className="auth-points">
            <span>✓ Multi-side package analysis</span>
            <span>✓ Evidence-backed results</span>
            <span>✓ No-guess verification</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-heading">
            <span>INSPECTOR CONSOLE</span>
            <h2>Welcome back.</h2>
            <p>Sign in to continue your inspection workflow.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Inspector Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Inspector ID</label>
            <input
              type="text"
              placeholder="e.g. INS-001"
              value={inspectorId}
              onChange={(e) => setInspectorId(e.target.value)}
            />

            {error && <div className="error-message">{error}</div>}

            <button className="auth-submit" disabled={loading}>
              {loading ? "Authenticating..." : "Enter Console →"}
            </button>
          </form>

          <div className="auth-divider">
            <span>NEW TO METRALENS?</span>
          </div>

          <button className="signup-link" onClick={onSignup}>
            Create Inspector Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;