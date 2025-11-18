const React = require("react");
const { Sidebar } = require("./sidebar.js");

const ContentContainer = ({ children }) => {
  return React.createElement(
    "div",
    {
      className: "mainContainer flex flex-col w-full h-full",
    },
    children
  );
};

const MainContainer = ({ children, isOpen, onToggle }) => {
  return React.createElement(
    "div",
    {
      className:
        "appContainer flex items-center selft-stretch flex-1 w-full h-full",
    },
    [
      React.createElement(Sidebar, {
        key: "sidebar",
        isOpen: isOpen,
        onToggle: onToggle,
      }),
      React.createElement(
        ContentContainer,
        {
          key: "content-container",
        },
        children
      ),
    ]
  );
};

module.exports = { MainContainer, ContentContainer };
