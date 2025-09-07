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
      className: "flex flex-col gap-[3px] w-full overflow-y-auto max-h-[200px]",
    },
    projects.map((project) =>
      React.createElement(
        "div",
        {
          key: project.id,
          className: `flex items-center justify-between p-2.5 rounded-lg cursor-pointer ${
            selectedProject && selectedProject.id === project.id
              ? "bg-violet-50"
              : "hover:bg-gray-50"
          }`,
        },
        [
          React.createElement(
            "div",
            {
              key: "content",
              className: "flex items-center gap-2 flex-1",
              onClick: () => onProjectSelect(project),
            },
            [
              React.createElement(MaterialIcon, {
                key: "folder",
                name: "folder_open",
                className:
                  selectedProject && selectedProject.id === project.id
                    ? "text-[#2d2a45]"
                    : "text-[#5e5c7f]",
              }),
              React.createElement(
                "span",
                {
                  key: "name",
                  className: `text-[13px] ${
                    selectedProject && selectedProject.id === project.id
                      ? "text-[#2d2a45]"
                      : "text-[#5e5c7f]"
                  }`,
                  style: { fontFamily: "Noto Sans", lineHeight: "20px" },
                },
                project.name
              ),
            ]
          ),
          React.createElement(MaterialIcon, {
            key: "delete",
            name: "delete",
            className: "text-[#5e5c7f] hover:text-red-500 cursor-pointer",
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
      return JSON.parse(localStorage.getItem("projects") || "[]");
    } catch (error) {
      console.error("Error loading projects from localStorage:", error);
      return [];
    }
  });
  const { navigate } = useRouter(); // Add useRouter

  // Handle new project and auto-expand
  React.useEffect(() => {
    if (newProject) {
      console.log("New project received:", newProject);
      setProjects((prevProjects) => {
        const updatedProjects = [
          newProject,
          ...prevProjects.filter((p) => p.id !== newProject.id),
        ];
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        return updatedProjects;
      });
      setSelectedProject(newProject);
      localStorage.setItem("currentProject", JSON.stringify(newProject));
      setIsExpanded(true);
      navigate("project-view", { project: newProject }); // Ensure navigation for new project
    }
  }, [newProject, navigate]);

  // Load currentProject from localStorage on mount
  React.useEffect(() => {
    try {
      const currentProject = JSON.parse(localStorage.getItem("currentProject"));
      if (currentProject) {
        setSelectedProject(currentProject);
      }
    } catch (error) {
      console.error("Error loading currentProject from localStorage:", error);
    }
  }, []);

  const handleProjectSelect = (project) => {
    console.log("Selected project:", project);
    setSelectedProject(project);
    localStorage.setItem("currentProject", JSON.stringify(project));
    navigate("project-view", { project }); // Navigate to project-view with selected project
  };

  const handleProjectDelete = (projectToDelete) => {
    console.log("Deleting project:", projectToDelete);
    const updatedProjects = projects.filter((p) => p.id !== projectToDelete.id);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    if (selectedProject && selectedProject.id === projectToDelete.id) {
      setSelectedProject(null);
      localStorage.removeItem("currentProject");
      navigate("welcome"); // Navigate to welcome if current project is deleted
    }
  };

  return React.createElement(
    "div",
    {
      className: "flex flex-col gap-[3px] w-full",
    },
    [
      React.createElement(
        "div",
        {
          key: "header",
          className:
            "flex items-center justify-between px-2.5 py-2 cursor-pointer",
          onClick: () => setIsExpanded(!isExpanded),
        },
        [
          React.createElement(
            "div",
            {
              key: "label",
              className: "text-[#8a7bea] text-[11px] font-normal",
              style: { fontFamily: "Noto Sans", lineHeight: "19.5px" },
            },
            "MY LAST PROJECTS"
          ),
          React.createElement(MaterialIcon, {
            key: "arrow",
            name: isExpanded ? "keyboard_arrow_down" : "keyboard_arrow_right",
            className: "text-[#8a7bea]",
          }),
        ]
      ),
      ...(isExpanded
        ? [
            React.createElement(ProjectsList, {
              key: "projects-list",
              projects: projects,
              selectedProject: selectedProject,
              onProjectSelect: handleProjectSelect,
              onProjectDelete: handleProjectDelete,
            }),
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
        "bg-white border border-[#f1f0fb] rounded-lg p-4 w-full max-w-[552px] flex flex-col gap-3",
    },
    [
      React.createElement(
        "div",
        {
          key: "project-tag",
          className:
            "bg-[#f1f0fb] px-2.5 py-1 rounded text-[#5e5c7f] text-[11px] self-start",
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
              className: "flex items-center gap-2 cursor-pointer",
              onClick: onReportClick,
            },
            [
              React.createElement(MaterialIcon, {
                key: "chart-icon",
                name: "insert_chart_outlined",
                size: 24,
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
                size: 24,
                className: "text-[#5e5c7f] cursor-pointer hover:text-[#2d2a45]",
                onClick: onDownload,
              }),
              React.createElement(MaterialIcon, {
                key: "delete",
                name: "delete",
                size: 24,
                className: "text-[#5e5c7f] cursor-pointer hover:text-red-500",
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
