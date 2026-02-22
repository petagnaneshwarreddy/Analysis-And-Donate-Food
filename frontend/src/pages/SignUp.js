import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://backend-food-analysis.onrender.com";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const PERKS = {
  household: [
    "Full access to food analysis",
    "Unlimited food donations",
    "Track & reduce household food waste",
    "Cost savings insights",
    "Lower your carbon footprint",
    "Help families in need",
  ],
  business: [
    "Full access to food analysis",
    "Unlimited donation listings",
    "Higher profit margins",
    "Tax benefits",
    "Competitive advantage",
    "Minimize carbon emissions",
  ],
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .su-root {
    min-height: 100vh;
    background: #09090f;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow-x: hidden;
  }

  .su-glow-1 {
    position: fixed; top: -180px; left: -100px;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .su-glow-2 {
    position: fixed; bottom: -140px; right: -80px;
    width: 460px; height: 460px; border-radius: 50%;
    background: radial-gradient(circle, rgba(87,183,255,0.13) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .su-hero {
    width: 100%; max-width: 860px;
    padding: 68px 32px 44px;
    text-align: center;
    position: relative; z-index: 1;
  }

  .su-badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: #ff6b35;
    border: 1px solid rgba(255,107,53,0.35);
    border-radius: 100px; padding: 6px 18px; margin-bottom: 26px;
    background: rgba(255,107,53,0.07);
  }

  .su-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #ff6b35;
    animation: pulse 1.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .su-hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(34px, 5.5vw, 62px);
    font-weight: 800; line-height: 1.06; letter-spacing: -2px;
    margin-bottom: 16px;
  }

  .su-hero h1 .accent {
    background: linear-gradient(120deg, #ff6b35 30%, #ffb088);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .su-hero p {
    font-size: 16px; font-weight: 300;
    color: rgba(255,255,255,0.45);
    max-width: 480px; margin: 0 auto; line-height: 1.75;
  }

  .su-tabs {
    display: flex;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 5px;
    margin-bottom: 36px;
    position: relative; z-index: 1;
  }

  .su-tab {
    padding: 11px 38px;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-size: 13.5px; font-weight: 700; letter-spacing: 0.4px;
    cursor: pointer; border: none;
    background: transparent; color: rgba(255,255,255,0.38);
    transition: all 0.22s ease;
  }

  .su-tab.active {
    background: linear-gradient(135deg, #ff6b35, #e84e1b);
    color: #fff;
    box-shadow: 0 4px 22px rgba(255,107,53,0.38);
  }

  .su-card {
    width: 100%; max-width: 500px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px; padding: 42px 40px 36px;
    position: relative; z-index: 1;
    margin-bottom: 28px;
    backdrop-filter: blur(16px);
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .su-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 700;
    margin-bottom: 26px; color: #fff;
  }

  .su-card-title span { color: #ff6b35; }

  .su-field { margin-bottom: 14px; }

  .su-field label {
    display: block;
    font-size: 11px; font-weight: 500;
    letter-spacing: 1.2px; text-transform: uppercase;
    color: rgba(255,255,255,0.35); margin-bottom: 7px;
  }

  .su-field input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; color: #fff; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .su-field input::placeholder { color: rgba(255,255,255,0.18); }

  .su-field input:focus {
    border-color: rgba(255,107,53,0.55);
    background: rgba(255,107,53,0.05);
    box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
  }

  .su-perks {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px 14px; margin: 22px 0 26px;
  }

  .su-perk {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; color: rgba(255,255,255,0.48);
  }

  .su-perk-icon {
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(255,107,53,0.12);
    border: 1px solid rgba(255,107,53,0.28);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 9px; color: #ff6b35; font-weight: 700;
  }

  .su-btn {
    width: 100%; padding: 15px;
    border-radius: 11px; border: none;
    background: linear-gradient(135deg, #ff6b35 0%, #e84e1b 100%);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700; letter-spacing: 0.8px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    box-shadow: 0 6px 26px rgba(255,107,53,0.38);
    display: flex; align-items: center; justify-content: center; gap: 9px;
  }

  .su-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 34px rgba(255,107,53,0.48);
  }

  .su-btn:active:not(:disabled) { transform: translateY(0); opacity: 0.88; }
  .su-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .su-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.28);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .su-toast {
    position: fixed; top: 24px; left: 50%;
    transform: translateX(-50%);
    padding: 13px 26px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 500;
    z-index: 999; white-space: nowrap; max-width: 90vw;
    animation: toastIn 0.3s ease;
    display: flex; align-items: center; gap: 9px;
  }

  .su-toast.success {
    background: rgba(20,200,120,0.12);
    border: 1px solid rgba(20,200,120,0.35);
    color: #14c878;
  }

  .su-toast.error {
    background: rgba(255,70,70,0.1);
    border: 1px solid rgba(255,70,70,0.32);
    color: #ff6b6b;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .su-countdown {
    text-align: center; font-size: 12.5px;
    color: rgba(255,255,255,0.3); margin-top: 13px;
  }

  .su-countdown b { color: #ff6b35; }

  .su-footer {
    font-size: 13.5px; color: rgba(255,255,255,0.3);
    margin-bottom: 60px; position: relative; z-index: 1;
  }

  .su-footer a { color: #ff6b35; text-decoration: none; font-weight: 500; }
  .su-footer a:hover { text-decoration: underline; }

  @media (max-width: 540px) {
    .su-card { padding: 28px 20px; }
    .su-perks { grid-template-columns: 1fr; }
    .su-tab { padding: 11px 22px; font-size: 12.5px; }
  }
`;

const SignUp = () => {
  // ── original state (unchanged) ───────────────────────────────────────
  const [tab, setTab] = useState("household");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const navigate = useNavigate();

  // ── original effect (unchanged) ──────────────────────────────────────
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      navigate("/login");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  // ── original handlers (unchanged) ────────────────────────────────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const showToast = (type, message) => {
    setToast({ type, message });
    if (type === "error") {
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!PASSWORD_REGEX.test(form.password)) {
      showToast(
        "error",
        "Password must contain uppercase, lowercase, number & special character."
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE}/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      showToast("success", "Account created successfully!");
      setCountdown(5);
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.error || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="su-root">
        <div className="su-glow-1" />
        <div className="su-glow-2" />

        {/* Toast */}
        {toast && (
          <div className={`su-toast ${toast.type}`}>
            <span>{toast.type === "success" ? "✓" : "✕"}</span>
            {toast.message}
          </div>
        )}

        {/* Hero */}
        <div className="su-hero">
          <div className="su-badge">
            <span className="su-badge-dot" />
            Join the Movement
          </div>
          <h1>
            Make a difference<br />with <span className="accent">fEEDfORWARD</span>
          </h1>
          <p>
            Join our community and help reduce food waste — one meal at a time.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="su-tabs">
          <button
            className={`su-tab ${tab === "household" ? "active" : ""}`}
            onClick={() => setTab("household")}
          >
            🏠 Household
          </button>
          <button
            className={`su-tab ${tab === "business" ? "active" : ""}`}
            onClick={() => setTab("business")}
          >
            🏢 Business
          </button>
        </div>

        {/* Card */}
        <div className="su-card" key={tab}>
          <div className="su-card-title">
            Sign up as a{" "}
            <span>{tab === "household" ? "Household" : "Business"}</span>
          </div>

          {/* Form — all original field names & handlers preserved */}
          <form onSubmit={handleSubmit}>
            <div className="su-field">
              <label>{tab === "business" ? "Business Name" : "Full Name"}</label>
              <input
                type="text"
                name="username"
                placeholder={tab === "business" ? "Enter business name" : "Enter your full name"}
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="su-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="su-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="su-field">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {/* Perks */}
            <div className="su-perks">
              {PERKS[tab].map((perk) => (
                <div key={perk} className="su-perk">
                  <div className="su-perk-icon">✓</div>
                  {perk}
                </div>
              ))}
            </div>

            {/* Submit — original disabled logic preserved */}
            <button
              type="submit"
              className="su-btn"
              disabled={loading || countdown !== null}
            >
              {loading && <span className="su-spinner" />}
              {loading
                ? "Creating Account…"
                : countdown !== null
                ? `Redirecting in ${countdown}s…`
                : "Create Account →"}
            </button>
          </form>

          {countdown !== null && (
            <p className="su-countdown">
              Taking you to login in <b>{countdown}</b> seconds…
            </p>
          )}
        </div>

        <p className="su-footer">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </>
  );
};

export default SignUp;
