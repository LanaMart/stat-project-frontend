const React = require("react");

/**
 * Badge - A removable label badge component
 *
 * @param {Object} props
 * @param {string} props.label - Badge text
 * @param {Function} props.onRemove - Called when the × button is clicked
 * @param {string} props.className - Additional classes
 */
const Badge = ({ label = "", onRemove, className = "" }) => {
  return React.createElement(
    "div",
    {
      className: `bg-stat-white border border-stat-primary-100 flex items-center gap-1sm px-2sm rounded-full h-[33px] ${className}`,
    },
    React.createElement(
      "span",
      { className: "font-noto font-normal text-sm leading-5 text-stat-font whitespace-nowrap" },
      label
    ),
    onRemove &&
      React.createElement(
        "button",
        {
          type: "button",
          className: "flex items-center justify-center w-4 h-4 shrink-0 text-stat-font-secondary hover:text-stat-font transition-colors",
          onClick: onRemove,
          "aria-label": `Remove ${label}`,
        },
        React.createElement(
          "svg",
          { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          React.createElement("path", {
            d: "M9 1L1 9M1 1L9 9",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
          })
        )
      )
  );
};

module.exports = { Badge };
