const React = require("react");
const ReactDOM = require("react-dom/client");
const { DialogProvider } = require("./components/dialog.js");
const { RouterProvider } = require("./router/router.js");
const { Header } = require("./components/layout/header.js");
const { Footer } = require("./components/layout/footer.js");
const { MainContainer } = require("./components/layout/mainContainer.js");
const { AppRouter } = require("./router/appRouter.js");

const App = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return React.createElement(
    "div",
    {
      className: `relative h-screen rounded-lg flex flex-col ${
        sidebarOpen ? "ml-0" : "ml-0"
      }`,
    },
    [
      React.createElement(Header, { key: "header" }),
      React.createElement(
        MainContainer,
        {
          key: "main-container",
          isOpen: sidebarOpen,
          onToggle: () => {
            console.log("Toggling sidebar, current state:", sidebarOpen);
            setSidebarOpen(!sidebarOpen);
          },
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
      React.createElement(RouterProvider, null, React.createElement(App))
    )
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
}
