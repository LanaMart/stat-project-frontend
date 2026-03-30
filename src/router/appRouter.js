const React = require("react");
const { useRouter } = require("./router.js");
const { WelcomePage } = require("../pages/welcomePage.js");
const { ProjectViewPage } = require("../pages/projectViewPage.js");
const { LoginPage } = require("../pages/loginPage.js");

// Router Component
const AppRouter = () => {
  const { currentRoute, routeParams } = useRouter();

  const renderPage = () => {
    console.log(
      "Rendering page for route:",
      currentRoute,
      "with params:",
      routeParams
    );
    switch (currentRoute) {
      case "login":
        return React.createElement(LoginPage);
      case "welcome":
        return React.createElement(WelcomePage);
      case "project-view":
        const project = routeParams?.project;
        if (!project?.id) {
          console.warn("No project ID in routeParams");
          return React.createElement(WelcomePage);
        }
        return React.createElement(ProjectViewPage, { project });
      default:
        return React.createElement(WelcomePage);
    }
  };

  return React.createElement(
    "div",
    {
      className: "flex flex-col items-start self-stretch w-full h-full",
    },
    renderPage()
  );
};

module.exports = { AppRouter };
