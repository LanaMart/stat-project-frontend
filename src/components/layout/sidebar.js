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
      console.log(`Creating new project: "${projectName}"`);
      const existingProjects = JSON.parse(
        localStorage.getItem("projects") || "[]"
      );
      existingProjects.unshift(newProject);
      localStorage.setItem("projects", JSON.stringify(existingProjects));
      localStorage.setItem("currentProject", JSON.stringify(newProject));
      setProjectName("");
      setNewProject(newProject);
      navigate("project-view", { project: newProject });
      console.log(
        `Project "${projectName}" created and navigated to project-view!`
      );
    } else {
      console.log("Project name is empty");
    }
  };

  return React.createElement(
    "div",
    {
      className: `relative top-14 h-screen bg-stat-white p-2sm flex flex-col gap-2sm ${
        isOpen
          ? "w-[340px] bg-stat-accent-green"
          : "w-[65px] overflow-hidden bg-stat-error-100"
      } left-0`,
      style: { border: "1px solid var(--stat-primary-50)", zIndex: 1000 },
      onClick: (e) => console.log("Sidebar clicked, target:", e.target),
    },
    [
      React.createElement(
        "div",
        {
          key: "toggle",
          className:
            "bg-stat-white h-1sm flex items-center justify-end px-1sm rounded-sm cursor-pointer sidebar-toggle",
          style: { zIndex: 1000, position: "relative" },
          onClick: (e) => {
            console.log(
              "Toggle clicked, isOpen:",
              isOpen,
              "event target:",
              e.target
            );
            onToggle();
          },
        },
        [
          React.createElement(MaterialIcon, {
            key: "toggle-icon",
            name: isOpen ? "menu_open" : "menu",
            className: "stat-primary text-base",
            style: { fontSize: 24, cursor: "pointer" },
          }),
        ]
      ),
      ...(isOpen
        ? [
            React.createElement(
              "div",
              {
                key: "header",
                className: "flex flex-col gap-1sm pb-1sm",
              },
              [
                React.createElement(StatBridgeLogo, { key: "logo" }),
                React.createElement(
                  "div",
                  {
                    key: "tagline",
                    className:
                      "text-stat-font-secondary text-lg font-semibold leading-6 text-center w-4/5 mx-auto",
                    style: { fontFamily: "var(--noto)" },
                  },
                  "Where Business meets Data"
                ),
              ]
            ),
            React.createElement(
              "div",
              {
                key: "projects",
                className: "flex flex-col gap-md",
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
                              "project-input flex items-center justify-between px-1sm py-md rounded-md border border-stat-primary-100 bg-stat-white cursor-text",
                          },
                          [
                            React.createElement("input", {
                              key: "input",
                              type: "text",
                              placeholder: "Create new project",
                              value: projectName,
                              onChange: (e) => {
                                console.log("Input changed:", e.target.value);
                                setProjectName(e.target.value);
                              },
                              onKeyDown: (e) => {
                                console.log("Key pressed:", e.key);
                                if (e.key === "Enter") {
                                  handleCreateProject();
                                }
                              },
                              className:
                                "flex-1 bg-transparent outline-none text-sm text-stat-font placeholder-stat-font-secondary",
                              style: {
                                fontFamily: "var(--noto)",
                                lineHeight: "20px",
                              },
                            }),
                            React.createElement(MaterialIcon, {
                              key: "edit-icon",
                              name: "edit",
                              className: "text-stat-primary",
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
                            onClick: () => {
                              console.log(
                                "Save button clicked, projectName:",
                                projectName
                              );
                              handleCreateProject();
                            },
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
            React.createElement(MyLastProjectsSection, {
              key: "my-last-projects",
              newProject: newProject,
            }),
          ]
        : []),
    ]
  );
};

module.exports = { Sidebar };
