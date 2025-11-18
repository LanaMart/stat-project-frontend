const React = require("react");
const { MaterialIcon } = require("../button.js");

const Footer = () => {
  return React.createElement(
    "div",
    {
      className:
        "footer bg-stat-primary-50 border-t border-stat-primary-100 rounded-b-lg flex items-center self-stretch justify-between p-3lg",
      //style: { zIndex: 1001 }, // Higher than sidebar's z-index: 1000
      onClick: (e) => console.log("Footer clicked, target:", e.target), // Debug click
    },
    [
      React.createElement(
        "div",
        {
          key: "version",
          className:
            "flex items-center gap-1sm text-stat-font text-sm font-noto",
        },
        React.createElement(MaterialIcon, {
          key: "info",
          name: "info",
          className:
            "material-icons-outlined text-stat-primary cursor-pointer hover:text-stat-primary-800",
          onClick: () => console.log("Support icon clicked"),
        }),
        "About the app"
      ),
    ]
  );
};

module.exports = { Footer };
