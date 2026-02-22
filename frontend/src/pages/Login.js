import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const API_BASE = "https://backend-food-analysis.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-body {
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

  .login-body::before {
    content: '';
    position: fixed; top: -160px; left: -120px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,107,53,0.17) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-body::after {
    content: '';
    position: fixed; bottom: -150px; right: -100px;
    width: 440px; height: 440px; border-radius: 50%;
    background: radial-gradient(circle, rgba(87,183,255,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-body-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  .login-container {
    width: 100%;
    max-width: 440px;
  }

  .form-container {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 28px;
    padding: 48px 44px 42px;
    backdrop-filter: blur(18px);
    animation: fadeUp 0.35s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lg-brand {
    text-align: center;
    margin-bottom: 32px;
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

  /* original h1.opacity class — restyled */
  h1.opacity {
    font-family: 'Syne', sans-serif;
    font-size: 30px; font-weight: 800;
    letter-spacing: -1px; line-height: 1.1;
    color: #fff; margin-bottom: 6px;
  }

  h1.opacity .accent {
    background: linear-gradient(120deg, #ff6b35 30%, #ffb088);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lg-subtitle {
    font-size: 14px; font-weight: 300;
    color: rgba(255,255,255,0.38);
    margin-top: 4px;
  }

  .form-container h2 {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700;
    margin-bottom: 20px; color: #fff;
    text-align: center;
  }

  /* Inputs */
  .form-container input[type="email"],
  .form-container input[type="password"] {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 11px; padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px; color: #fff; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    margin-bottom: 14px;
    display: block;
  }

  .form-container input::placeholder {
    color: rgba(255,255,255,0.22);
    font-size: 11.5px; letter-spacing: 1.2px;
  }

  .form-container input:focus {
    border-color: rgba(255,107,53,0.55);
    background: rgba(255,107,53,0.05);
    box-shadow: 0 0 0 3px rgba(255,107,53,0.1);
  }

  /* MUI Button overrides */
  .login-button.MuiButton-root {
    background: linear-gradient(135deg, #ff6b35, #e84e1b) !important;
    color: #fff !important;
    font-family: 'Syne', sans-serif !important;
    font-size: 14px !important; font-weight: 700 !important;
    letter-spacing: 1px !important;
    border-radius: 11px !important;
    padding: 14px !important;
    box-shadow: 0 6px 26px rgba(255,107,53,0.38) !important;
    text-transform: uppercase !important;
    transition: transform 0.15s, box-shadow 0.15s !important;
    margin-top: 6px !important;
  }

  .login-button.MuiButton-root:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 34px rgba(255,107,53,0.48) !important;
  }

  .forgot-password-button.MuiButton-root {
    background: transparent !important;
    border: 1px solid rgba(255,255,255,0.09) !important;
    color: rgba(255,255,255,0.4) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 13px !important;
    border-radius: 11px !important;
    padding: 12px !important;
    margin-top: 10px !important;
    text-transform: none !important;
    box-shadow: none !important;
    transition: border-color 0.2s, color 0.2s, background 0.2s !important;
  }

  .forgot-password-button.MuiButton-root:hover {
    border-color: rgba(255,107,53,0.4) !important;
    color: #ff6b35 !important;
    background: rgba(255,107,53,0.05) !important;
  }

  .reset-password-button.MuiButton-root {
    background: linear-gradient(135deg, #ff6b35, #e84e1b) !important;
    color: #fff !important;
    font-family: 'Syne', sans-serif !important;
    font-size: 14px !important; font-weight: 700 !important;
    border-radius: 11px !important;
    padding: 14px !important;
    box-shadow: 0 6px 26px rgba(255,107,53,0.38) !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    transition: transform 0.15s, box-shadow 0.15s !important;
  }

  .reset-password-button.MuiButton-root:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 34px rgba(255,107,53,0.48) !important;
  }

  .cancel-button.MuiButton-root {
    background: transparent !important;
    border: 1px solid rgba(255,255,255,0.09) !important;
    color: rgba(255,255,255,0.4) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 13px !important;
    border-radius: 11px !important;
    padding: 12px !important;
    margin-top: 10px !important;
    text-transform: none !important;
    box-shadow: none !important;
    transition: border-color 0.2s, color 0.2s !important;
  }

  .cancel-button.MuiButton-root:hover {
    border-color: rgba(255,107,53,0.4) !important;
    color: #ff6b35 !important;
    background: rgba(255,107,53,0.05) !important;
  }

  /* Divider */
  .lg-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 18px 0 14px;
  }

  .lg-divider-line {
    flex: 1; height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .lg-divider span {
    font-size: 11px; color: rgba(255,255,255,0.2);
    letter-spacing: 1px;
  }

  /* original .signup-link */
  .signup-link {
    text-align: center;
    font-size: 13.5px; color: rgba(255,255,255,0.3);
    margin-top: 4px;
  }

  .signup-link a {
    color: #ff6b35; text-decoration: none; font-weight: 500;
  }

  .signup-link a:hover { text-decoration: underline; }

  /* original .message */
  .message {
    margin-top: 18px;
    padding: 12px 20px;
    border-radius: 100px;
    font-size: 13.5px; font-weight: 500;
    text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .message.success {
    background: rgba(20,200,120,0.12);
    border: 1px solid rgba(20,200,120,0.35);
    color: #14c878;
  }

  .message.error {
    background: rgba(255,70,70,0.1);
    border: 1px solid rgba(255,70,70,0.32);
    color: #ff6b6b;
  }

  /* original .countdown-timer */
  .countdown-timer {
    text-align: center;
    font-size: 12px; color: rgba(255,255,255,0.28);
    margin-top: 12px;
  }

  .countdown-timer span {
    color: #ff6b35; font-weight: 600;
  }

  @media (max-width: 480px) {
    .form-container { padding: 32px 20px 28px; }
    h1.opacity { font-size: 24px; }
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
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
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

  // ── original JSX structure — only UI styles added ────────────────────
  return (
    <>
      <style>{styles}</style>

      <div className="login-body">
        <section className="login-body-container">
          <div className="login-container">
            <div className="form-container">

              {/* Brand header — added above original h1 */}
              <div className="lg-brand">
                <div className="lg-badge">
                  <span className="lg-badge-dot" />
                  fEEDfORWARD
                </div>
                <h1 className="opacity">
                  {isResettingPassword
                    ? <>Reset your <span className="accent">password</span></>
                    : <>Welcome <span className="accent">back</span></>}
                </h1>
                <p className="lg-subtitle">
                  {isResettingPassword
                    ? "We'll send a reset link to your inbox."
                    : "Sign in to continue making a difference."}
                </p>
              </div>

              {!isResettingPassword ? (
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <Button
                    className="login-button"
                    type="submit"
                    variant="contained"
                    fullWidth
                  >
                    LOG IN
                  </Button>

                  <Button
                    className="forgot-password-button"
                    onClick={() => setIsResettingPassword(true)}
                    fullWidth
                  >
                    Forgot Password?
                  </Button>

                  <div className="lg-divider">
                    <div className="lg-divider-line" />
                    <span>OR</span>
                    <div className="lg-divider-line" />
                  </div>

                  <p className="signup-link">
                    Don't have an account?{" "}
                    <Link to="/signup">Sign Up</Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <h2>Reset Your Password</h2>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />

                  <Button
                    className="reset-password-button"
                    type="submit"
                    variant="contained"
                    fullWidth
                  >
                    Send Reset Email
                  </Button>

                  <Button
                    className="cancel-button"
                    onClick={() => setIsResettingPassword(false)}
                    fullWidth
                  >
                    ← Back to Login
                  </Button>
                </form>
              )}

              {/* Message — original className logic preserved */}
              {loginMessage && (
                <p
                  className={`message ${
                    loginMessage === "Login Successfully" ? "success" : "error"
                  }`}
                >
                  {loginMessage === "Login Successfully" ? "✓" : "✕"} {loginMessage}
                </p>
              )}

              {/* Countdown — original condition preserved */}
              {countdown !== null && countdown > 0 && (
                <p className="countdown-timer">
                  Redirecting in <span>{countdown}</span> seconds...
                </p>
              )}

            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
