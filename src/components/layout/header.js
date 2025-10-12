const React = require("react");
const { MaterialIcon } = require("../button.js");

// Header Component
const Header = () => {
  return React.createElement(
    "div",
    {
      className:
        "absolute top-0 left-0 w-full h-14 bg-stat-primary-50 border-b border-stat-primary-100 rounded-t-lg flex items-center gap-3md px-3md drag-region",
      style: { zIndex: 20 },
    },
    [
      React.createElement(
        "div",
        {
          key: "app-title-section",
          className: "flex items-center gap-1sm",
        },
        [
          React.createElement(MaterialIcon, {
            key: "foundation-icon",
            name: "foundation",
            className: "text-stat-primary",
          }),
          React.createElement(
            "div",
            {
              key: "app-name",
              className: "text-stat-font text-sm font-semibold font-noto",
            },
            "StatBridge App"
          ),
        ]
      ),
    ]
  );
};

module.exports = { Header };
