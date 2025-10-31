const React = require("react");
const { useDialog } = require("./dialog.js");
const { MaterialIcon } = require("./button.js");
const { useRouter } = require("../router/router.js");

// List of projects in expanded state
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
            // don't change this p-variable, it makes the bottom projects visible!!
            selectedProject && selectedProject.id === project.id
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
                  selectedProject && selectedProject.id === project.id
                    ? "text-stat-primary-600 material-icons-outlined "
                    : "text-stat-primary-400 material-icons-outlined ",
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

// Toggle project list show/hide
const MyLastProjectsSection = ({ newProject }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [projects, setProjects] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("projects_list") || "[]"); // Изменено: список проектов в отдельном ключе
    } catch (error) {
      console.error("Error loading projects list from localStorage:", error);
      return [];
    }
  });
  const { navigate } = useRouter();

  // Handle new project and auto-expand
  React.useEffect(() => {
    if (newProject) {
      const newId = newProject.id; // make sure the id is generated (e.g., Date.now() in the calling code)
      setProjects((prevProjects) => {
        const updatedProjects = [
          newProject,
          ...prevProjects.filter((p) => p.id !== newId),
        ];
        localStorage.setItem("projects_list", JSON.stringify(updatedProjects));
        return updatedProjects;
      });

      // For a new project: We save the initialState in Local Storage by ID (isolated)
      const initialStateForNew = {
        projectState: "upload",
        uploadSubState: "idle",
        currentFile: null,
        progress: 0,
        processingTimeEstimate: null,
        projectMeta: { name: newProject.name, createdAt: newProject.createdAt },
      };
      localStorage.setItem(
        `project_data_${newId}`,
        JSON.stringify(initialStateForNew)
      ); // Пустое состояние

      setSelectedProject(newProject);
      setIsExpanded(true);
      navigate("project-view", { project: newProject });
    }
  }, [newProject, navigate]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    navigate("project-view", { project });
  };

  const handleProjectDelete = (projectToDelete) => {
    const deletedId = projectToDelete.id;
    const updatedProjects = projects.filter((p) => p.id !== deletedId);
    setProjects(updatedProjects);
    localStorage.setItem("projects_list", JSON.stringify(updatedProjects));

    // Удаляем изолированное состояние проекта
    localStorage.removeItem(`project_data_${deletedId}`);

    if (selectedProject && selectedProject.id === deletedId) {
      setSelectedProject(null);
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
                React.createElement(ProjectsList, {
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
      React.createElement(
        "div",
        {
          key: "main-line",
          className: "flex items-center justify-between w-full",
        },
        [
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
                  " material-icons-outlined text-[#5e5c7f] cursor-pointer hover:text-red-500",
                onClick: onDelete,
              }),
            ]
          ),
        ]
      ),
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
