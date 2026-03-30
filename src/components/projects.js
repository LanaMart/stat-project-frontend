const React = require("react");
const { useDialog } = require("./dialog.js");
const { MaterialIcon } = require("./button.js");
const { useRouter } = require("../router/router.js");
const { apiClient } = require("./apiClient.js");

// ============================================================================
// ProjectsList
// ============================================================================
const ProjectsList = ({
  projects,
  selectedProject,
  onProjectSelect,
  onProjectDelete,
}) => {
  const { showDialog } = useDialog();

  return React.createElement(
    "div",
    { className: "flex flex-col gap-2xs w-full pb-12" },
    projects.map((project) =>
      React.createElement(
        "div",
        {
          key: project.id,
          className: `flex items-center justify-between p-2.5 rounded-sm cursor-pointer ${
            selectedProject?.id === project.id
              ? "bg-stat-primary-50"
              : "hover:bg-stat-bg"
          }`,
        },
        [
          React.createElement(
            "div",
            {
              key: "content",
              className: "flex items-center gap-2xs flex-1",
              onClick: () => onProjectSelect(project),
            },
            [
              React.createElement(MaterialIcon, {
                key: "folder",
                name: "folder",
                className:
                  selectedProject?.id === project.id
                    ? "text-stat-primary-600 material-icons-outlined"
                    : "text-stat-primary-400 material-icons-outlined",
              }),
              React.createElement(
                "span",
                {
                  key: "name",
                  className: `text-sm font-noto ${
                    selectedProject?.id === project.id
                      ? "text-stat-font"
                      : "text-stat-font-secondary"
                  }`,
                },
                project.name
              ),
            ]
          ),
          React.createElement(MaterialIcon, {
            key: "delete",
            name: "delete",
            className:
              "material-icons-outlined text-stat-font-secondary hover:text-red-500 cursor-pointer",
            onClick: (e) => {
              e.stopPropagation();
              showDialog({
                projectName: project.name,
                onConfirm: () => onProjectDelete(project),
              });
            },
          }),
        ]
      )
    )
  );
};

// ============================================================================
// MyLastProjectsSection
// ============================================================================
const MyLastProjectsSection = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [projects, setProjects] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { navigate, currentProject, isAuthenticated } = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      const list = await apiClient.getProjects();
      setProjects(list);
      setIsLoading(false);
    };
    load();
  }, [isAuthenticated]);

  const handleSelect = (project) => {
    navigate("project-view", { project });
  };

  const handleDelete = async (project) => {
    await apiClient.deleteProject(project.id);
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    if (currentProject?.id === project.id) {
      navigate("welcome");
    }
  };

  return React.createElement(
    "div",
    {
      className: "flex flex-col gap-2xs w-full h-full",
      style: {
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      },
    },
    [
      // Header
      React.createElement(
        "div",
        {
          key: "header",
          className:
            "flex items-center justify-between px-2xs py-3md cursor-pointer flex-shrink-0",
          onClick: () => setIsExpanded((v) => !v),
        },
        [
          React.createElement(
            "div",
            {
              key: "label",
              className: "text-stat-primary-400 text-xs font-noto",
            },
            "MY PROJECTS"
          ),
          React.createElement(MaterialIcon, {
            key: "arrow",
            name: isExpanded ? "keyboard_arrow_down" : "keyboard_arrow_right",
            className: "text-stat-primary-400",
          }),
        ]
      ),

      // Project list
      isExpanded &&
        React.createElement(
          "div",
          {
            key: "list-wrapper",
            style: {
              flex: "1 1 0",
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            },
          },
          isLoading
            ? React.createElement(
                "div",
                {
                  className: "text-stat-font-secondary text-sm p-2.5 font-noto",
                },
                "Loading projects..."
              )
            : projects.length === 0
            ? React.createElement(
                "div",
                {
                  className: "text-stat-font-secondary text-sm p-2.5 font-noto",
                },
                "No projects yet"
              )
            : React.createElement(ProjectsList, {
                projects,
                selectedProject: currentProject,
                onProjectSelect: handleSelect,
                onProjectDelete: handleDelete,
              })
        ),
    ].filter(Boolean)
  );
};

module.exports = { MyLastProjectsSection };
