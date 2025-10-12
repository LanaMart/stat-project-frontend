const React = require("react");

const QPushButton = ({ onClick, children, className = "" }) => {
  return React.createElement(
    "button",
    {
      onClick,
      className: `bg-stat-primary text-stat-old-bg h-9 px-3md py-2sm rounded flex items-center justify-center gap-1sm hover-effect font-noto cursor-pointer ${className}`,
      style: {
        appearance: "none",
        WebkitAppearance: "none",
      },
    },
    children
  );
};

// Material Icons Component
const MaterialIcon = ({ name, className = "", size = 24, onClick }) => {
  return React.createElement(
    "span",
    {
      className: `material-icons ${className}`,
      style: { fontSize: size, cursor: onClick ? "pointer" : "default" },
      onClick: onClick,
    },
    name
  );
};

module.exports = {
  QPushButton,
  MaterialIcon,
};
