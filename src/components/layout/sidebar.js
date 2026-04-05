const React = require("react");
const { MyLastProjectsSection } = require("../projects.js");
const { QPushButton, MaterialIcon } = require("../button.js");
const { useRouter } = require("../../router/router.js");
const { apiClient } = require("../apiClient.js");

const StatBridgeLogo = () => {
  return React.createElement("img", {
    src: "../assets/images/logo.png",
    alt: "StatSynergy Logo",
    className: "w-[75%] mx-auto object-contain rounded-lg",
    key: "logo-img",
  });
};

const Sidebar = ({ isOpen, onToggle }) => {
  const [projectName, setProjectName] = React.useState("");
  const [newProject, setNewProject] = React.useState(null);
  const { navigate } = useRouter();

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    try {
      const created = await apiClient.createProject({
        name: projectName.trim(),
      });
      setProjectName("");
      //setNewProject(created);
      navigate("project-view", { project: created });
    } catch (e) {
      console.error(e);
    }
  };

  return React.createElement(
    "div",
    {
      className: `sideBar bg-stat-white p-3lg flex flex-col gap-3lg border border-stat-primary-50 h-full transition-all duration-300 ${
        isOpen ? "w-64 bg-stat-accent-green" : "w-16 bg-stat-error-100"
      } left-0`,
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
        React.createElement(MaterialIcon, {
          name: isOpen ? "menu_open" : "menu",
          className: "text-stat-primary cursor-pointer text-xxl",
        }),
      ),

      ...(isOpen
        ? [
            // Header with logo and slogan
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
                      "text-stat-font text-base font-semibold leading-6 text-center w-4/5 mx-auto font-noto",
                  },
                  "Where Business meets Data",
                ),
              ],
            ),

            // Блок создания проекта
            React.createElement(
              "div",
              {
                key: "create-block",
                className: "flex flex-col gap-3md flex-shrink-0",
              },
              React.createElement(
                "div",
                { key: "content", className: "flex flex-col gap-2sm" },
                [
                  React.createElement(
                    "div",
                    {
                      key: "input-wrapper",
                      className: "flex flex-col gap-2xs w-full",
                    },
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
                          onKeyDown: (e) =>
                            e.key === "Enter" && handleCreateProject(),
                          className:
                            "flex-1 bg-transparent outline-none text-sm text-stat-font placeholder:text-grey-400 font-noto",
                        }),
                        React.createElement(MaterialIcon, {
                          key: "edit-icon",
                          name: "edit",
                          className:
                            "material-icons-outlined text-stat-primary",
                        }),
                      ],
                    ),
                  ),

                  React.createElement(
                    "div",
                    {
                      key: "button-container",
                      className: "flex justify-center w-full",
                    },
                    React.createElement(
                      QPushButton,
                      {
                        key: "save-btn",
                        style: { appearance: "none", WebkitAppearance: "none" },
                        onClick: handleCreateProject,
                      },
                      [
                        React.createElement(MaterialIcon, {
                          key: "check",
                          name: "check",
                          size: 20,
                          className: "text-stat-old-bg",
                        }),
                        React.createElement(
                          "span",
                          { key: "text", className: "text-base" },
                          "Save",
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Список проектов
            React.createElement(
              "div",
              {
                key: "scroll-container",
                className: "flex-1 min-h-0 overflow-hidden",
                style: { display: "flex", flexDirection: "column" },
              },
              React.createElement(MyLastProjectsSection, { newProject }),
            ),
          ]
        : []),
    ],
  );
};

module.exports = { Sidebar };
