const React = require("react");

const QPushButton = ({ onClick, children, className = "" }) => {
  return React.createElement(
    "button",
    {
      onClick,
      className: `bg-[#6a5acd] text-white h-9 px-3 py-2.5 rounded flex items-center justify-center gap-2 hover-effect cursor-pointer ${className}`,
      style: {
        fontFamily: "Noto Sans",
        lineHeight: "20px",
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
