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

const QPushButtonWithPlus = ({ onClick }) => {
  return React.createElement(
    "button",
    {
      className:
        "bg-[#6a5acd] h-9 px-3 py-2.5 rounded flex items-center justify-center gap-2 hover-effect cursor-pointer",
      onClick: () => {
        console.log("Plus button clicked");
        onClick();
      },
      key: "plus-button",
    },
    [
      React.createElement(MaterialIcon, {
        key: "plus-icon",
        name: "add",
        size: 24,
        className: "text-[#ebfaff]",
      }),
    ]
  );
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
      className: `relative top-14 h-screen bg-white p-[10px] flex flex-col gap-5 ${
        isOpen
          ? "w-[220px] bg-green-100"
          : "w-[65px] overflow-hidden bg-red-100"
      } left-0`, // Add left-0 to fix to left edge
      style: { border: "1px solid #f1f0fb", zIndex: 1000 },
      onClick: (e) => console.log("Sidebar clicked, target:", e.target),
    },
    [
      React.createElement(
        "div",
        {
          key: "toggle",
          className:
            "bg-white h-[30px] flex items-center justify-end px-2.5 rounded cursor-pointer sidebar-toggle",
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
            className: "text-gray-700",
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
                className: "flex flex-col gap-[5px] pb-[5px]",
              },
              [
                React.createElement(StatBridgeLogo, { key: "logo" }),
                React.createElement(
                  "div",
                  {
                    key: "tagline",
                    className:
                      "text-[#5e5c7f] text-[16px] font-semibold leading-6 text-center w-4/5 mx-auto",
                    style: { fontFamily: "Noto Sans" },
                  },
                  "Where Business meets Data"
                ),
              ]
            ),
            React.createElement(
              "div",
              {
                key: "projects",
                className: "flex flex-col gap-4",
              },
              [
                React.createElement(
                  "div",
                  {
                    key: "content",
                    className: "flex flex-col gap-2.5",
                  },
                  [
                    React.createElement(
                      "div",
                      {
                        key: "input-wrapper",
                        className: "flex flex-col gap-[3px] w-full",
                      },
                      [
                        React.createElement(
                          "div",
                          {
                            key: "input-container",
                            className:
                              "project-input flex items-center justify-between px-2.5 py-4 rounded border border-[#e5e3f7] bg-white cursor-text",
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
                                "flex-1 bg-transparent outline-none text-[13px] text-[rgba(94,92,127,0.51)] placeholder-[rgba(94,92,127,0.51)]",
                              style: {
                                fontFamily: "Noto Sans",
                                lineHeight: "20px",
                              },
                            }),
                            React.createElement(MaterialIcon, {
                              key: "edit-icon",
                              name: "edit",
                              className: "text-[#6a5acd]",
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
                              className: "text-[#ebfaff]",
                            }),
                            React.createElement(
                              "span",
                              { key: "text" },
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
        : [
            React.createElement(QPushButtonWithPlus, {
              key: "plus-button",
              onClick: () => {
                console.log("Plus button clicked");
                onToggle();
              },
            }),
          ]),
    ]
  );
};

module.exports = { Sidebar };
