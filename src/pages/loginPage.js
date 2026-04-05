const React = require("react");
const { useState } = React;
const { apiClient } = require("../components/apiClient.js");
const { useRouter } = require("../router/router.js");
const { QPushButton } = require("../components/button.js");

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
      setError(
        "__success__Registration successful! Please check your email to confirm your account.",
      );
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
    { className: "flex flex-row w-full h-full font-noto" },

    // ── Left panel: logo ──────────────────────────────────────────────────
    React.createElement(
      "div",
      {
        className:
          "flex-1 min-w-0 bg-stat-primary-50 flex items-center justify-center p-4xl",
      },
      React.createElement("img", {
        src: "../assets/images/loginPic.svg",
        alt: "StatSynergy login picture",
        style: {
          maxWidth: "383px",
          width: "100%",
          height: "auto",
          objectFit: "contain",
        },
      }),
    ),

    // ── Right panel: login card ───────────────────────────────────────────
    React.createElement(
      "div",
      {
        className:
          "flex-1 min-w-0 bg-stat-bg flex items-center justify-center p-4xl",
      },

      React.createElement(
        "div",
        {
          className:
            "bg-stat-white border border-stat-primary-100 rounded-md flex flex-col gap-4xl items-center px-3xl py-4xl w-full max-w-[360px]",
        },

        // Title
        React.createElement(
          "div",
          { className: "flex flex-col gap-xs items-center w-full" },
          React.createElement(
            "h1",
            {
              className:
                "font-noto font-bold text-xxl text-stat-font text-center",
            },
            "Welcome back",
          ),
          React.createElement(
            "p",
            {
              className:
                "font-noto font-normal text-base text-stat-font-secondary text-center",
            },
            "Sign in or create a new account",
          ),
        ),

        // Fields
        React.createElement(
          "div",
          { className: "flex flex-col gap-3md w-full" },

          // Email
          React.createElement(
            "div",
            { className: "flex flex-col gap-[6px] w-full" },
            React.createElement(
              "label",
              {
                className: "font-noto font-medium text-sm text-stat-font",
                htmlFor: "login-email",
              },
              "Email",
            ),
            React.createElement("input", {
              id: "login-email",
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: "you@example.com",
              disabled: loading,
              className:
                "w-full bg-stat-white border border-stat-primary-100 rounded-sm px-3md py-2sm font-noto font-normal text-sm text-stat-font placeholder:text-grey-400 focus:outline-none focus:border-stat-primary transition-colors",
            }),
          ),

          // Password
          React.createElement(
            "div",
            { className: "flex flex-col gap-[6px] w-full" },
            React.createElement(
              "label",
              {
                className: "font-noto font-medium text-sm text-stat-font",
                htmlFor: "login-password",
              },
              "Password",
            ),
            React.createElement("input", {
              id: "login-password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "••••••••",
              onKeyDown: (e) => e.key === "Enter" && handleLogin(),
              disabled: loading,
              className:
                "w-full bg-stat-white border border-stat-primary-100 rounded-sm px-3md py-2sm font-noto font-normal text-sm text-stat-font placeholder:text-grey-400 focus:outline-none focus:border-stat-primary transition-colors",
            }),
          ),

          // Feedback message
          error &&
            React.createElement(
              "div",
              {
                className: `font-noto text-sm px-3md py-2sm rounded-sm ${
                  isSuccess
                    ? "bg-stat-success-50 text-stat-success-700 border border-stat-success"
                    : "bg-stat-error-50 text-stat-error-700 border border-stat-error-200"
                }`,
              },
              displayMessage,
            ),
        ),

        // Buttons
        React.createElement(
          "div",
          { className: "flex flex-col gap-1sm w-full" },

          React.createElement(
            QPushButton,
            {
              variant: "primary",
              onClick: handleLogin,
              disabled: loading,
              className: "w-full",
            },
            loading ? "Please wait…" : "Log in",
          ),

          React.createElement(
            QPushButton,
            {
              variant: "outline",
              onClick: handleRegister,
              disabled: loading,
              className: "w-full",
            },
            loading ? "Please wait…" : "Register",
          ),
        ),
      ),
    ),
  );
};

module.exports = { LoginPage };
