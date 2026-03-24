const React = require("react");
const { useState } = React;
const { apiClient } = require("../components/apiClient.js");
const { useRouter } = require("../router/router.js");

const LoginPage = () => {
  const { setIsAuthenticated } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await apiClient.loginUser(email, password);
      if (!result) {
        setError("Invalid email or password.");
        return;
      }
      setIsAuthenticated(true);
    } catch (err) {
      const msg = err?.message || String(err);
      if (msg.includes("not confirmed")) {
        setError("Email not confirmed yet. Please check your inbox.");
      } else {
        setError(msg || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await apiClient.registerUser(email, password);
      setError(null);
      // Show success hint inline
      setError("__success__Registration successful! Please check your email to confirm your account.");
    } catch (err) {
      const msg = err?.message || String(err);
      if (msg.includes("already registered")) {
        setError("This email is already registered. Please log in.");
      } else {
        setError(msg || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = error && error.startsWith("__success__");
  const displayMessage = isSuccess ? error.slice("__success__".length) : error;

  return React.createElement(
    "div",
    {
      className:
        "flex flex-col items-center justify-center w-full h-full bg-stat-bg font-noto",
    },
    React.createElement(
      "div",
      {
        className:
          "flex flex-col gap-3lg w-full max-w-[360px] bg-stat-white rounded-xl shadow-xl p-7xl",
      },
      [
        // Title
        React.createElement(
          "div",
          { key: "title", className: "flex flex-col gap-xs" },
          [
            React.createElement(
              "h1",
              {
                key: "h1",
                className: "text-xxl font-bold text-stat-font text-center",
              },
              "Welcome back"
            ),
            React.createElement(
              "p",
              {
                key: "sub",
                className: "text-sm text-stat-font-secondary text-center",
              },
              "Sign in or create a new account"
            ),
          ]
        ),

        // Email field
        React.createElement(
          "div",
          { key: "email-field", className: "flex flex-col gap-xs" },
          [
            React.createElement(
              "label",
              {
                key: "label",
                className: "text-sm font-medium text-stat-font",
                htmlFor: "login-email",
              },
              "Email"
            ),
            React.createElement("input", {
              key: "input",
              id: "login-email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@example.com",
              className:
                "w-full px-3md py-1sm rounded-2sm border border-stat-font-tertiary text-stat-font text-sm bg-stat-bg focus:outline-none focus:border-stat-primary transition-colors duration-150",
              disabled: loading,
            }),
          ]
        ),

        // Password field
        React.createElement(
          "div",
          { key: "password-field", className: "flex flex-col gap-xs" },
          [
            React.createElement(
              "label",
              {
                key: "label",
                className: "text-sm font-medium text-stat-font",
                htmlFor: "login-password",
              },
              "Password"
            ),
            React.createElement("input", {
              key: "input",
              id: "login-password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••",
              onKeyDown: (e) => e.key === "Enter" && handleLogin(),
              className:
                "w-full px-3md py-1sm rounded-2sm border border-stat-font-tertiary text-stat-font text-sm bg-stat-bg focus:outline-none focus:border-stat-primary transition-colors duration-150",
              disabled: loading,
            }),
          ]
        ),

        // Feedback message
        error &&
          React.createElement(
            "div",
            {
              key: "feedback",
              className: `text-sm px-3md py-1sm rounded-2sm ${
                isSuccess
                  ? "bg-stat-success-50 text-stat-success-700 border border-stat-success"
                  : "bg-stat-error-50 text-stat-error-700 border border-stat-error-200"
              }`,
            },
            displayMessage
          ),

        // Buttons
        React.createElement(
          "div",
          { key: "buttons", className: "flex flex-col gap-xs" },
          [
            React.createElement(
              "button",
              {
                key: "login-btn",
                onClick: handleLogin,
                disabled: loading,
                className:
                  "w-full py-1sm rounded-2sm bg-stat-primary text-stat-white text-sm font-semibold hover:bg-stat-primary-600 active:bg-stat-primary-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
              },
              loading ? "Please wait…" : "Log in"
            ),
            React.createElement(
              "button",
              {
                key: "register-btn",
                onClick: handleRegister,
                disabled: loading,
                className:
                  "w-full py-1sm rounded-2sm border border-stat-primary text-stat-primary text-sm font-semibold hover:bg-stat-primary-50 active:bg-stat-primary-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
              },
              loading ? "Please wait…" : "Register"
            ),
          ]
        ),
      ]
    )
  );
};

module.exports = { LoginPage };
