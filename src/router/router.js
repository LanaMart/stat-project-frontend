const React = require("react");
const { apiClient, refreshAccessToken } = require("../components/apiClient.js");

const RouterContext = React.createContext();

const useRouter = () =>
  React.useContext(RouterContext) ??
  (() => {
    throw new Error("No RouterProvider");
  })();

const RouterProvider = ({ children }) => {
  const [route, setRoute] = React.useState("login");
  const [params, setParams] = React.useState(null);
  const [currentProject, setCurrentProject] = React.useState(null);
  //const [isAuthenticated, setIsAuthenticated] = React.useState(false); this line always starts us as not logged in, does not use token
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        await refreshAccessToken(); // silently get a fresh access token
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    })();
  }, []);

  const navigate = React.useCallback((to, p = null) => {
    setRoute(to);
    setParams(p);
    if (to === "project-view" && p?.project) setCurrentProject(p.project);
    if (to === "welcome") setCurrentProject(null);
  }, []);

  // Load projects and navigate to the last one after login
  React.useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const projects = await apiClient.getProjects();
        if (projects.length > 0) {
          const last = projects[0];
          setCurrentProject(last);
          navigate("project-view", { project: last });
        } else {
          navigate("welcome");
        }
      } catch (err) {
        console.error("Failed to load projects after login:", err);
        navigate("welcome");
      }
    })();
  }, [isAuthenticated]); // Re-runs when user logs in

  const value = React.useMemo(
    () => ({
      currentRoute: route,
      routeParams: params,
      currentProject,
      navigate,
      isAuthenticated,
      setIsAuthenticated,
    }),
    [route, params, currentProject, navigate, isAuthenticated, setIsAuthenticated]
  );

  return React.createElement(RouterContext.Provider, { value }, children);
};

module.exports = { RouterProvider, useRouter };
