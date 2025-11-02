const React = require("react");

/**
 * ProjectHeader - Project header component. Displays the project name and creation date.

 * @param {Object} props
 * @param {Object} props.project - project object
 * @param {string} props.project.name 
 * @param {string} props.project.createdAt - date of creation project (ISO string)
 *
 * @example
 * <ProjectHeader
 *   project={{
 *     name: "My Project",
 *     createdAt: "2025-10-31T16:52:00Z"
 *   }}
 * />
 */
const ProjectHeader = ({ project }) => {
  /**
   * Formatting the date into a readable format.
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  return React.createElement(
    "div",
    {
      "className":
        "bg-stat-bg border-b border-stat-primary-100 flex flex-col gap-xs px-3lg py-2sm w-full",
      "data-component": "ProjectHeader",
    },
    [
      // Project Title
      React.createElement(
        "div",
        {
          key: "title",
          className: "flex items-end h-4xl",
        },
        React.createElement(
          "p",
          {
            className:
              "font-noto font-bold text-base leading-4xl text-stat-font whitespace-nowrap",
          },
          project.name
        )
      ),

      // Created Date
      React.createElement(
        "div",
        {
          key: "subtitle",
          className: "flex items-center",
        },
        React.createElement(
          "p",
          {
            className:
              "font-noto font-normal text-sm leading-3xl text-stat-font-secondary whitespace-nowrap",
          },
          `Created: ${formatDate(project.createdAt)}`
        )
      ),
    ]
  );
};

module.exports = { ProjectHeader };
