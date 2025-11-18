// src/components/layout/mainContainer.js — ГЛОБАЛЬНОЕ ИСПРАВЛЕНИЕ (18 ноября 2025)
const React = require("react");
const { Sidebar } = require("./sidebar.js");

const ContentContainer = ({ children }) => {
  return React.createElement(
    "div",
    {
      className: "flex flex-col w-full h-full flex-1 min-h-0 overflow-hidden", // overflow-hidden + min-h-0 — ключ к жизни
    },
    children
  );
};

const MainContainer = ({ children, isOpen, onToggle }) => {
  return React.createElement(
    "div",
    {
      className: "main flex h-screen w-screen overflow-hidden bg-stat-bg", // h-screen w-screen overflow-hidden — основа всего
    },
    [
      React.createElement(Sidebar, {
        key: "sidebar",
        isOpen,
        onToggle,
      }),
      React.createElement(ContentContainer, { key: "content" }, children),
    ]
  );
};

module.exports = { MainContainer, ContentContainer };
