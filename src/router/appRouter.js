const React = require("react");
const { useRouter } = require("./router.js");
const { WelcomePage } = require("../pages/welcomePage.js");
const { ProjectViewPage } = require("../pages/projectViewPage.js");

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
      case "welcome":
        return React.createElement(WelcomePage);
      case "project-view":
        const project = routeParams?.project;
        if (!project?.id) {
          console.warn("No project ID in routeParams");
          return React.createElement(WelcomePage);
        }
        return React.createElement(
          ProjectProvider,
          { projectId: project.id }, // ← Динамический ID
          React.createElement(ProjectViewPage, { project })
        );
      default:
        return React.createElement(WelcomePage);
    }
  };

  return React.createElement(
    "div",
    {
      className: "relative top-14 bottom-14 left-0 right-0 overflow-auto",
      style: { width: "100%", height: "100%" },
    },
    renderPage()
  );
};

module.exports = { AppRouter };
