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

  // Restore last opened project on app startup
  React.useEffect(() => {
    (async () => {
      try {
        const projects = await apiClient.getProjects();
        if (projects.length > 0) {
          const last = projects[0]; // Newest first (due to unshift in createProject)
          setCurrentProject(last);
          if (route === "welcome") {
            navigate("project-view", { project: last });
          }
        }
        // If no projects exist → stay on welcome screen with empty sidebar
      } catch (err) {
        console.error("Failed to load projects on application start:", err);
        // On error, remain on welcome screen – safe fallback for future real API
      }
    })();
  }, []); // Run only once on mount

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
