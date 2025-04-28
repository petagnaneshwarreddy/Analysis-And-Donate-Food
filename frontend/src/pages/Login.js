import React, { useContext, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext"; // Adjust if necessary

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [resetEmail, setResetEmail] = useState(""); // State for email to reset password
  const [isResettingPassword, setIsResettingPassword] = useState(false); // Track if resetting password
  const navigate = useNavigate();
  const { handleLoginSuccess } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await axios.post("http://localhost:5000/login", userData);
      const data = response.data;

      const token = data.token;
      localStorage.setItem("token", token);

      setLoginMessage("Login Successfully");
      handleLoginSuccess();

      let timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        navigate("/"); // Redirect to home page after 5 seconds
      }, 5000);
    } catch (error) {
      if (error.response && error.response.data.error) {
        setLoginMessage(error.response.data.error);
      } else {
        setLoginMessage("Something went wrong");
      }
      console.log(error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setLoginMessage("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/forgot-password",
        { email: resetEmail }
      );
      setLoginMessage(response.data.message || "Password reset email sent!");
      setIsResettingPassword(false); // Hide reset password form after successful submission
    } catch (error) {
      if (error.response && error.response.data.error) {
        setLoginMessage(error.response.data.error);
      } else {
        setLoginMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-body">
      <section className="login-body-container">
        <div className="login-container">
          <div className="form-container">
            <img
              src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
              alt="illustration"
              className="illustration"
            />
            <h1 className="opacity">LOGIN</h1>
            {!isResettingPassword ? (
              <form>
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="login-button" onClick={handleLogin}>
                  LOG IN
                </Button>
                <Button
                  className="forgot-password-button"
                  onClick={() => setIsResettingPassword(true)} // Show reset password form
                >
                  Forgot Password?
                </Button>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <h2>Reset Your Password</h2>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <Button className="reset-password-button" type="submit">
                  Send Reset Email
                </Button>
                <Button
                  className="cancel-button"
                  onClick={() => setIsResettingPassword(false)} // Hide reset form
                >
                  Cancel
                </Button>
              </form>
            )}
            {loginMessage && (
              <p
                className={`message login-msg ${
                  loginMessage === "Login Successfully" ? "success" : "error"
                }`}
              >
                {loginMessage}
              </p>
            )}
            {loginMessage === "Login Successfully" && countdown > 0 && (
              <p className="countdown-timer login-timer">
                Redirecting in <span className="timer">{countdown}</span>{" "}
                seconds to HOME...
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
