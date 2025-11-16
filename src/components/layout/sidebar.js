const React = require("react");
const { MyLastProjectsSection } = require("../projects.js");
const { QPushButton, MaterialIcon } = require("../button.js");
const { useRouter } = require("../../router/router.js");

const StatBridgeLogo = () => {
  return React.createElement("img", {
    src: "../assets/images/logo.png",
    alt: "StatBridge Logo",
    className: "w-[55%] mx-auto object-contain rounded-lg",
    key: "logo-img",
  });
};

const Sidebar = ({ isOpen, onToggle }) => {
  const [projectName, setProjectName] = React.useState("");
  const [newProject, setNewProject] = React.useState(null);
  const { navigate } = useRouter();

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: projectName.trim(),
        createdAt: new Date().toISOString(),
      };
      const existingProjects = JSON.parse(
        localStorage.getItem("projects") || "[]"
      );
      existingProjects.unshift(newProject);
      localStorage.setItem("projects", JSON.stringify(existingProjects));
      localStorage.setItem("currentProject", JSON.stringify(newProject));
      setProjectName("");
      setNewProject(newProject);
      navigate("project-view", { project: newProject });
    }
  };

  return React.createElement(
    "div",
    {
      className: `sideBar relative top-14 bg-stat-white p-3lg flex flex-col gap-3lg border border-stat-primary-50 ${
        isOpen ? "w-[340px] bg-stat-accent-green" : "w-[65px] bg-stat-error-100"
      } left-0`,
      style: {
        zIndex: 1000,
        height: "calc(100vh - 56px)",
        maxHeight: "calc(100vh - 56px)",
      },
    },
    [
      React.createElement(
        "div",
        {
          key: "toggle",
          className:
            "h-3lg flex items-center justify-end text-stat-primary cursor-pointer text-xxl flex-shrink-0",
          onClick: onToggle,
        },
        [
          React.createElement(MaterialIcon, {
            key: "toggle-icon",
            name: isOpen ? "menu_open" : "menu",
            className: "text-stat-primary cursor-pointer, text-xxl",
          }),
        ]
      ),
      ...(isOpen
        ? [
            React.createElement(
              "div",
              {
                key: "header",
                className: "flex flex-col gap-1sm pb-1sm flex-shrink-0",
              },
              [
                React.createElement(StatBridgeLogo, { key: "logo" }),
                React.createElement(
                  "div",
                  {
                    key: "tagline",
                    className:
                      "text-stat-font-secondary text-lg font-semibold leading-6 text-center w-4/5 mx-auto font-noto",
                  },
                  "Where Business meets Data"
                ),
              ]
            ),
            React.createElement(
              "div",
              {
                key: "projects",
                className: "flex flex-col gap-3md flex-shrink-0",
              },
              [
                React.createElement(
                  "div",
                  {
                    key: "content",
                    className: "flex flex-col gap-2sm",
                  },
                  [
                    React.createElement(
                      "div",
                      {
                        key: "input-wrapper",
                        className: "flex flex-col gap-2xs w-full",
                      },
                      [
                        React.createElement(
                          "div",
                          {
                            key: "input-container",
                            className:
                              "flex items-center justify-between px-2sm py-3md rounded-sm border border-stat-primary-100 bg-stat-white cursor-text",
                          },
                          [
                            React.createElement("input", {
                              key: "input",
                              type: "text",
                              placeholder: "Create new project",
                              value: projectName,
                              onChange: (e) => setProjectName(e.target.value),
                              onKeyDown: (e) => {
                                if (e.key === "Enter") {
                                  handleCreateProject();
                                }
                              },
                              className:
                                "flex-1 bg-transparent outline-none text-sm text-stat-font placeholder:text-grey-400 font-noto",
                            }),
                            React.createElement(MaterialIcon, {
                              key: "edit-icon",
                              name: "edit",
                              className:
                                "material-icons-outlined text-stat-primary",
                            }),
                          ]
                        ),
                      ]
                    ),
                    React.createElement(
                      "div",
                      {
                        key: "button-container",
                        className: "flex justify-center w-full",
                      },
                      [
                        React.createElement(
                          QPushButton,
                          {
                            key: "save-button",
                            style: {
                              appearance: "none",
                              WebkitAppearance: "none",
                            },
                            onClick: handleCreateProject,
                          },
                          [
                            React.createElement(MaterialIcon, {
                              key: "check-icon",
                              name: "check",
                              size: 20,
                              className: "text-stat-old-bg",
                            }),
                            React.createElement(
                              "span",
                              { key: "text", className: "text-base" },
                              "Save"
                            ),
                          ]
                        ),
                      ]
                    ),
                  ]
                ),
              ]
            ),
            React.createElement(
              "div",
              {
                key: "projects-scroll-container",
                className: "flex-1 min-h-0 overflow-hidden",
                style: {
                  display: "flex",
                  flexDirection: "column",
                },
              },
              [
                React.createElement(MyLastProjectsSection, {
                  key: "my-last-projects",
                  newProject: newProject,
                }),
              ]
            ),
          ]
        : []),
    ]
  );
};

module.exports = { Sidebar };
