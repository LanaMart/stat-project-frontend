const React = require("react");
const { apiClient } = require("../components/apiClient.js");

const RouterContext = React.createContext();

const useRouter = () =>
  React.useContext(RouterContext) ??
  (() => {
    throw new Error("No RouterProvider");
  })();

const RouterProvider = ({ children }) => {
  const [route, setRoute] = React.useState("welcome");
  const [params, setParams] = React.useState(null);
  const [currentProject, setCurrentProject] = React.useState(null);

  const navigate = React.useCallback((to, p = null) => {
    setRoute(to);
    setParams(p);
    if (to === "project-view" && p?.project) setCurrentProject(p.project);
    if (to === "welcome") setCurrentProject(null);
  }, []);

  // Восстановление последнего проекта при запуске
  React.useEffect(() => {
    (async () => {
      const projects = await apiClient.getProjects();
      if (projects.length > 0) {
        const last = projects[0];
        setCurrentProject(last);
        if (route === "welcome") navigate("project-view", { project: last });
      }
    })();
  }, []);

  const value = React.useMemo(
    () => ({
      currentRoute: route,
      routeParams: params,
      currentProject,
      navigate,
    }),
    [route, params, currentProject, navigate]
  );

  return React.createElement(RouterContext.Provider, { value }, children);
};

module.exports = { RouterProvider, useRouter };
