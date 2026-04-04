const React = require("react");

/**
 * Question - A selectable question card component
 *
 * @param {Object} props
 * @param {string} props.title - Question title
 * @param {string} props.description - Question description
 * @param {string} props.example - Example text shown below the description
 * @param {boolean} props.selected - Whether this question is selected
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 */
const Question = ({
  title,
  description,
  example,
  selected = false,
  onClick,
  className = "",
}) => {
  return React.createElement(
    "div",
    {
      onClick: onClick,
      className: `bg-stat-white border rounded-2sm flex gap-3md items-start pl-2sm pr-3lg py-3md w-full cursor-pointer ${selected ? "border-stat-primary" : "border-stat-primary-100"} ${className}`,
    },
    // Radio button
    React.createElement(
      "div",
      { className: "shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center" },
      React.createElement(
        "div",
        {
          className: `w-5 h-5 rounded-full border-2 border-stat-primary flex items-center justify-center`,
        },
        selected &&
          React.createElement("div", {
            className: "w-2.5 h-2.5 rounded-full bg-stat-primary",
          })
      )
    ),
    // Content
    React.createElement(
      "div",
      { className: "flex flex-col gap-3md flex-1 min-w-0" },
      // Title
      title &&
        React.createElement(
          "span",
          {
            className:
              "font-noto text-base font-normal text-stat-font leading-6",
          },
          title
        ),
      // Description + Example
      React.createElement(
        "div",
        { className: "flex flex-col gap-xs w-full" },
        description &&
          React.createElement(
            "p",
            {
              className:
                "font-noto text-sm font-normal text-stat-font leading-5 m-0",
            },
            description
          ),
        example &&
          React.createElement(
            "p",
            {
              className:
                "font-noto text-xs font-normal text-stat-primary leading-4 m-0",
            },
            example
          )
      )
    )
  );
};

module.exports = { Question };
