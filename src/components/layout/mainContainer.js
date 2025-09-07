const React = require("react");
const { Sidebar } = require("./sidebar.js");

const ContentContainer = ({ children }) => {
  return React.createElement(
    "div",
    {
      className: "flex flex-col"
    },
    children
  );
};

const MainContainer = ({ children, isOpen, onToggle }) => {
  return React.createElement(
    "div",
    {
      className: "flex",
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
