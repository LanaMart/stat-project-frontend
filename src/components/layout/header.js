const React = require("react");
const { MaterialIcon } = require("../button.js");

// Header Component
const Header = () => {
  return React.createElement(
    "div",
    {
      className:
        "header bg-stat-primary-50 border-b border-stat-primary-100 rounded-t-lg flex h-14 items-center self-stretch p-3lg",
      //style: { zIndex: 20 },
    },
    [
      React.createElement(
        "div",
        {
          key: "app-title-section",
          className: "headerText flex items-center gap-1sm",
        },
        [
          React.createElement(MaterialIcon, {
            key: "all_inclusive-icon",
            name: "all_inclusive",
            className: "text-stat-primary",
          }),
          React.createElement(
            "div",
            {
              key: "app-name",
              className: "text-stat-font text-sm font-semibold font-noto",
            },
            "StatSynergy App"
          ),
        ]
      ),
    ]
  );
};

module.exports = { Header };
