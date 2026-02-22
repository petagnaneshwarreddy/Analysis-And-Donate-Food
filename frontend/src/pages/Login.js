import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const API_BASE = "https://backend-food-analysis.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    background: #09090f;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  /* Ambient glows */
  .lg-glow-1 {
    position: fixed; top: -160px; left: -120px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,0.17) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .lg-glow-2 {
    position: fixed; bottom: -150px; right: -100px;
    width: 440px; height: 440px; border-radius: 50%;
    background: radial-gradient(circle, rgba(87,183,255,0.12) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* Card */
  .lg-card {
    width: 100%; max-width: 440px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 28px;
    padding: 48px 44px 42px;
    position: relative; z-index: 1;
    backdrop-filter: blur(18px);
    animation: fadeUp 0.35s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Brand */
  .lg-brand {
    text-align: center; margin-bottom: 32px;
  }

  .lg-badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'Syne', sans-serif;
    font-size: 10.5px; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: #ff6b35;
    border: 1px solid rgba(255,107,53,0.35);
    border-radius: 100px; padding: 5px 16px;
    background: rgba(255,107,53,0.07);
    margin-bottom: 18px;
  }

  .lg-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #ff6b35;
    animation: pulse 1.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  .lg-title {
    font-family: 'Syne', sans-serif;
    font-size: 32px; font-weight: 800;
    letter-spacing: -1.2px; line-height: 1.1;
    margin-bottom: 6px;
  }

  .lg-title .accent {
    background: linear-gradient(120deg, #ff6b35 30%, #ffb088);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lg-subtitle {
    font-size: 14px; font-weight: 300;
    color: rgba(255,255,255,0.38);
  }

  /* Section heading */
  .lg-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-bottom: 20px;
    text-align: center;
  }

  /* Fields */
  .lg-field { margin-bottom: 14px; }

  .lg-field label {
    display: block;
    font-size: 10.5px; font-weight: 500;
    letter-spacing: 1.2px; text-transform: uppercase;
    color: rgba(255,255,255,0.32); margin-bottom: 7px;
  }

  .lg-field input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; color: #fff; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .lg-field input::placeholder { color: rgba(255,255,255,0.18); }

  .lg-field input:focus {
    border-color: rgba(255,107,53,0.55);
    background: rgba(255,107,53,0.05);
    box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
  }

  /* Primary button */
  .lg-btn {
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
    margin-top: 22px;
  }

  .lg-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 34px rgba(255,107,53,0.48);
  }

  .lg-btn:active:not(:disabled) { transform: translateY(0); opacity: 0.88; }
  .lg-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* Ghost button */
  .lg-btn-ghost {
    width: 100%; padding: 13px;
    border-radius: 11px;
    border: 1px solid rgba(255,255,255,0.09);
    background: transparent; color: rgba(255,255,255,0.45);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 400;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    margin-top: 10px;
  }

  .lg-btn-ghost:hover {
    border-color: rgba(255,107,53,0.4);
    color: #ff6b35;
    background: rgba(255,107,53,0.05);
  }

  /* Forgot password link */
  .lg-forgot {
    text-align: right; margin-top: 6px;
  }

  .lg-forgot button {
    background: none; border: none;
    color: rgba(255,107,53,0.75);
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; cursor: pointer;
    transition: color 0.2s;
    padding: 0;
  }

  .lg-forgot button:hover { color: #ff6b35; }

  /* Divider */
  .lg-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0 18px;
  }

  .lg-divider-line {
    flex: 1; height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .lg-divider span {
    font-size: 11px; color: rgba(255,255,255,0.22);
    letter-spacing: 1px;
  }

  /* Sign-up footer */
  .lg-signup-row {
    text-align: center;
    font-size: 13.5px; color: rgba(255,255,255,0.3);
    margin-top: 20px;
  }

  .lg-signup-row a {
    color: #ff6b35; text-decoration: none; font-weight: 500;
  }

  .lg-signup-row a:hover { text-decoration: underline; }

  /* Toast */
  .lg-toast {
    position: fixed; top: 24px; left: 50%;
    transform: translateX(-50%);
    padding: 12px 26px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; font-weight: 500;
    z-index: 999; white-space: nowrap; max-width: 90vw;
    animation: toastIn 0.3s ease;
    display: flex; align-items: center; gap: 9px;
  }

  .lg-toast.success {
    background: rgba(20,200,120,0.12);
    border: 1px solid rgba(20,200,120,0.35);
    color: #14c878;
  }

  .lg-toast.error {
    background: rgba(255,70,70,0.1);
    border: 1px solid rgba(255,70,70,0.32);
    color: #ff6b6b;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .lg-countdown {
    text-align: center; font-size: 12px;
    color: rgba(255,255,255,0.28); margin-top: 14px;
  }

  .lg-countdown b { color: #ff6b35; }

  @media (max-width: 480px) {
    .lg-card { padding: 32px 22px 28px; }
    .lg-title { font-size: 26px; }
  }
`;

const Login = () => {
  // ── original state (unchanged) ───────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const navigate = useNavigate();
  const { handleLoginSuccess } = useContext(AuthContext);

  // ── original effect (unchanged) ──────────────────────────────────────
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  // ── original handlers (unchanged) ────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");
    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      handleLoginSuccess();
      setLoginMessage("Login Successfully");
      setCountdown(5);
    } catch (error) {
      setLoginMessage(error?.response?.data?.error || "Invalid email or password");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setLoginMessage("Please enter your email.");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE}/forgot-password`, { email: resetEmail });
      setLoginMessage(response.data.message || "Reset email sent!");
      setIsResettingPassword(false);
    } catch (error) {
      setLoginMessage(error?.response?.data?.error || "Something went wrong.");
    }
  };

  const isSuccess = loginMessage === "Login Successfully";
  const toastType = isSuccess || loginMessage.toLowerCase().includes("sent") ? "success" : "error";

  return (
    <>
      <style>{styles}</style>
      <div className="lg-root">
        <div className="lg-glow-1" />
        <div className="lg-glow-2" />

        {/* Toast */}
        {loginMessage && (
          <div className={`lg-toast ${toastType}`}>
            <span>{toastType === "success" ? "✓" : "✕"}</span>
            {loginMessage}
          </div>
        )}

        <div className="lg-card">
          {/* Brand header */}
          <div className="lg-brand">
            <div className="lg-badge">
              <span className="lg-badge-dot" />
              fEEDfORWARD
            </div>
            <h1 className="lg-title">
              {isResettingPassword ? (
                <>Reset your <span className="accent">password</span></>
              ) : (
                <>Welcome <span className="accent">back</span></>
              )}
            </h1>
            <p className="lg-subtitle">
              {isResettingPassword
                ? "We'll send a reset link to your inbox."
                : "Sign in to continue making a difference."}
            </p>
          </div>

          {/* ── LOGIN FORM ── */}
          {!isResettingPassword ? (
            <form onSubmit={handleLogin}>
              <div className="lg-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="lg-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="lg-forgot">
                <button type="button" onClick={() => { setIsResettingPassword(true); setLoginMessage(""); }}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="lg-btn" disabled={countdown !== null}>
                {countdown !== null ? `Redirecting in ${countdown}s…` : "Log In →"}
              </button>

              {countdown !== null && (
                <p className="lg-countdown">Taking you home in <b>{countdown}</b> seconds…</p>
              )}

              <div className="lg-divider">
                <div className="lg-divider-line" />
                <span>OR</span>
                <div className="lg-divider-line" />
              </div>

              <p className="lg-signup-row">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </form>
          ) : (
            /* ── FORGOT PASSWORD FORM ── */
            <form onSubmit={handleForgotPassword}>
              <div className="lg-field">
                <label>Your Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="lg-btn">
                Send Reset Email →
              </button>

              <button
                type="button"
                className="lg-btn-ghost"
                onClick={() => { setIsResettingPassword(false); setLoginMessage(""); }}
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
