const React = require("react");
const ReactDOM = require("react-dom/client");
const path = require("path");
const { DialogProvider } = require("./components/dialog.js");
const { RouterProvider, useRouter } = require("./router/router.js");
const { Header } = require("./components/layout/header.js");
const { Footer } = require("./components/layout/footer.js");
const { MainContainer } = require("./components/layout/mainContainer.js");
const { AppRouter } = require("./router/appRouter.js");
const { LoginPage } = require("./pages/loginPage.js");

const App = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { currentRoute } = useRouter();

  if (currentRoute === "login") {
    const overlayPath = "file://" + path.join(__dirname, "../assets/images/overlay.png");
    return React.createElement(
      "div",
      {
        style: {
          position: "fixed",
          inset: 0,
          backgroundImage: `url('${overlayPath}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
      React.createElement(LoginPage)
    );
  }

  return React.createElement(
    "div",
    {
      className: "software h-screen rounded-lg flex flex-col items-start",
    },
    [
      React.createElement(Header, { key: "header" }),
      React.createElement(
        MainContainer,
        {
          key: "main-container",
          isOpen: sidebarOpen,
          onToggle: () => setSidebarOpen(!sidebarOpen),
        },
        [React.createElement(AppRouter, { key: "router" })]
      ),
      React.createElement(Footer, { key: "footer" }),
    ]
  );
};

try {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    React.createElement(
      DialogProvider,
      null,
      React.createElement(
        RouterProvider,
        null,
        React.createElement(App)
      )
    )
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
}
