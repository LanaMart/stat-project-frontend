const React = require("react");
const { useDialog } = require("./dialog.js");
const { MaterialIcon } = require("./button.js");
const { useRouter } = require("../router/router.js");
const { apiClient } = require("../components/apiClient.js");

// ============================================================================
// PROJECTS LIST COMPONENT
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
    {
      className: "flex flex-col gap-2xs w-full pb-12",
    },
    projects.map((project) =>
      React.createElement(
        "div",
        {
          key: project.id,
          className: `flex items-center justify-between p-2.5 rounded-sm cursor-pointer ${
            selectedProject && selectedProject.id === project.id
              ? "bg-stat-primary-50"
              : "hover:bg-stat-bg"
          }`,
        },
        [
          // Project content (clickable)
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
                  selectedProject && selectedProject.id === project.id
                    ? "text-stat-primary-600 material-icons-outlined"
                    : "text-stat-primary-400 material-icons-outlined",
              }),
              React.createElement(
                "span",
                {
                  key: "name",
                  className: `text-sm font-noto ${
                    selectedProject && selectedProject.id === project.id
                      ? "text-stat-font"
                      : "text-stat-font-secondary"
                  }`,
                },
                project.name
              ),
            ]
          ),

          // Delete button
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
// MY PROJECTS SECTION COMPONENT
// ============================================================================

const MyLastProjectsSection = ({ newProject }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { navigate } = useRouter();

  // ============================================================================
  // LOAD PROJECTS FROM BACKEND
  // ============================================================================

  React.useEffect(() => {
    const loadProjects = async () => {
      try {
        // TODO: connect to backend API here
        // GET /api/projects
        const projectsList = await apiClient.getProjects();
        setProjects(projectsList);
      } catch (error) {
        console.error("❌ Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // ============================================================================
  // HANDLE NEW PROJECT
  // ============================================================================

  React.useEffect(() => {
    if (newProject) {
      // TODO: connect to backend API here
      // POST /api/projects уже должен был быть вызван до этого момента
      // Здесь мы просто добавляем проект в локальный state для UI

      setProjects((prevProjects) => {
        // Проверяем, не существует ли уже проект с таким ID
        const exists = prevProjects.some((p) => p.id === newProject.id);
        if (exists) {
          return prevProjects;
        }

        // Добавляем новый проект в начало списка
        return [newProject, ...prevProjects];
      });

      // Выбираем новый проект и открываем список
      setSelectedProject(newProject);
      setIsExpanded(true);

      // Переходим на страницу проекта
      navigate("project-view", { project: newProject });
    }
  }, [newProject, navigate]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    navigate("project-view", { project });
  };

  const handleProjectDelete = async (projectToDelete) => {
    try {
      // TODO: connect to backend API here
      // DELETE /api/projects/{projectId}
      await apiClient.deleteProject(projectToDelete.id);

      // Обновляем локальный state
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p.id !== projectToDelete.id)
      );

      // Если удалённый проект был выбран, сбрасываем выбор
      if (selectedProject && selectedProject.id === projectToDelete.id) {
        setSelectedProject(null);
        navigate("welcome");
      }
    } catch (error) {
      console.error("❌ Error deleting project:", error);
      // TODO: Показать уведомление об ошибке
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

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
      // Header (toggle button)
      React.createElement(
        "div",
        {
          key: "header",
          className:
            "flex items-center justify-between px-2xs py-3md cursor-pointer flex-shrink-0",
          onClick: () => setIsExpanded(!isExpanded),
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

      // Projects list (when expanded)
      ...(isExpanded
        ? [
            React.createElement(
              "div",
              {
                key: "projects-list-wrapper",
                style: {
                  flex: "1 1 0",
                  minHeight: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                },
              },
              [
                isLoading
                  ? React.createElement(
                      "div",
                      {
                        key: "loading",
                        className:
                          "text-stat-font-secondary text-sm p-2.5 font-noto",
                      },
                      "Loading projects..."
                    )
                  : projects.length === 0
                  ? React.createElement(
                      "div",
                      {
                        key: "empty",
                        className:
                          "text-stat-font-secondary text-sm p-2.5 font-noto",
                      },
                      "No projects yet"
                    )
                  : React.createElement(ProjectsList, {
                      key: "projects-list",
                      projects: projects,
                      selectedProject: selectedProject,
                      onProjectSelect: handleProjectSelect,
                      onProjectDelete: handleProjectDelete,
                    }),
              ]
            ),
          ]
        : []),
    ]
  );
};

// ============================================================================
// REPORT CARD COMPONENT (for future use)
// ============================================================================

const ReportCard = ({
  projectName,
  reportTitle,
  description,
  onReportClick,
  onDownload,
  onDelete,
}) => {
  return React.createElement(
    "div",
    {
      className:
        "bg-stat-white border border-stat-primary-50 rounded-lg p-4 w-full max-w-[552px] flex flex-col gap-xs",
    },
    [
      // Project tag
      React.createElement(
        "div",
        {
          key: "project-tag",
          className:
            "bg-stat-primary-50 px-2sm py-xs rounded text-stat-font-secondary text-xs self-start",
          style: { fontFamily: "Noto Sans", lineHeight: "19.5px" },
        },
        projectName
      ),

      // Main line with report info and actions
      React.createElement(
        "div",
        {
          key: "main-line",
          className: "flex items-center justify-between w-full",
        },
        [
          // Report info (clickable)
          React.createElement(
            "div",
            {
              key: "report-info",
              className: "flex items-center gap-1sm cursor-pointer",
              onClick: onReportClick,
            },
            [
              React.createElement(MaterialIcon, {
                key: "chart-icon",
                name: "insert_chart_outlined",
                className: "text-[#6a5acd]",
              }),
              React.createElement(
                "div",
                {
                  key: "report-title",
                  className: "text-[#6a5acd] text-[13px] font-bold",
                  style: { fontFamily: "Noto Sans", lineHeight: "20px" },
                },
                reportTitle
              ),
            ]
          ),

          // Actions
          React.createElement(
            "div",
            {
              key: "actions",
              className: "flex items-center gap-2",
            },
            [
              React.createElement(MaterialIcon, {
                key: "download",
                name: "download",
                className: "text-[#5e5c7f] cursor-pointer hover:text-[#2d2a45]",
                onClick: onDownload,
              }),
              React.createElement(MaterialIcon, {
                key: "delete",
                name: "delete",
                className:
                  "material-icons-outlined text-[#5e5c7f] cursor-pointer hover:text-red-500",
                onClick: onDelete,
              }),
            ]
          ),
        ]
      ),

      // Description
      React.createElement(
        "div",
        {
          key: "description",
          className: "text-[#2d2a45] text-[13px]",
          style: { fontFamily: "Noto Sans", lineHeight: "20px" },
        },
        description
      ),
    ]
  );
};

module.exports = {
  MyLastProjectsSection,
  ProjectsList,
  ReportCard,
};
