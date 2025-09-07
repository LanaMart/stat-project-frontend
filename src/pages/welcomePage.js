const React = require("react");

// Welcome Page Component
const WelcomePage = () => {
  return React.createElement(
    "div",
    {
      className:
        "flex flex-col items-center justify-start gap-4 w-full max-w-[414px] mx-auto",
      style: { paddingTop: "100px" },
    },
    [
      React.createElement(
        "div",
        {
          key: "welcome-text",
          className: "text-[#2d2a45] text-[16px] text-center leading-5 w-full",
          style: { fontFamily: "Noto Sans" },
        },
        [
          React.createElement(
            "p",
            {
              key: "welcome-message",
              className: "mb-4",
            },
            "Welcome to the wonderfull statistic app that help you to be a master of statistics."
          ),
          React.createElement(
            "p",
            {
              key: "instruction-message",
            },
            "Please add a new project"
          ),
        ]
      ),
    ]
  );
};

module.exports = { WelcomePage };