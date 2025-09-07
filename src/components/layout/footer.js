const React = require("react");
const { MaterialIcon } = require("../button.js");

const Footer = () => {
  return React.createElement(
    "div",
    {
      className:
        "absolute bottom-0 left-0 w-full h-14 bg-[#f1f0fb] border-t border-[#e5e3f7] rounded-b-lg flex items-center justify-between px-4",
      style: { zIndex: 1001 }, // Higher than sidebar's z-index: 1000
      onClick: (e) => console.log("Footer clicked, target:", e.target), // Debug click
    },
    [
      React.createElement(
        "div",
        {
          key: "version",
          className: "text-[#5e5c7f] text-[12px]",
          style: { fontFamily: "Noto Sans" },
        },
        "Version 1.0.0"
      ),
      React.createElement(
        "div",
        {
          key: "actions",
          className: "flex items-center gap-2",
        },
        [
          React.createElement(MaterialIcon, {
            key: "support",
            name: "support_agent",
            className: "text-[#5e5c7f] cursor-pointer hover:text-[#2d2a45]",
            onClick: () => console.log("Support icon clicked"),
          }),
          React.createElement(MaterialIcon, {
            key: "settings",
            name: "settings",
            className: "text-[#5e5c7f] cursor-pointer hover:text-[#2d2a45]",
            onClick: () => console.log("Settings icon clicked"),
          }),
        ]
      ),
    ]
  );
};

module.exports = { Footer };
