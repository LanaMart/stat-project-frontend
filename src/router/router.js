const React = require("react");

// Router Context
const RouterContext = React.createContext();

// Simple Router Hook
const useRouter = () => {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

// Router Provider
const RouterProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = React.useState("welcome");
  const [routeParams, setRouteParams] = React.useState(null);

  const navigate = React.useCallback((route, params = null) => {
    console.log("Navigating to:", route, "with params:", params);
    setCurrentRoute(route);
    setRouteParams(params);
  }, []);

  const value = React.useMemo(
    () => ({
      currentRoute,
      routeParams,
      navigate,
    }),
    [currentRoute, routeParams, navigate]
  );

  return React.createElement(
    RouterContext.Provider,
    {
      value: value,
    },
    children
  );
};

module.exports = {
  RouterProvider,
  useRouter,
  RouterContext,
};
