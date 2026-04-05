const React = require("react");

/**
 * QPushButton - A universal push button component from the figma design system
 *
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary' | 'secondary' | 'tertiary' | 'outline'} props.variant -  Button variant
 * @param {boolean} props.disabled - disabled button
 * @param {boolean} props.withIcon - button with an icon
 * @param {string} props.className - Additional classes
 */
const QPushButton = ({
  onClick,
  children,
  variant = "primary",
  disabled = false,
  withIcon = false,
  className = "",
}) => {
  const baseStyles =
    "h-9 px-3md py-2sm rounded flex items-center justify-center gap-1sm font-noto font-bold cursor-pointer transition-all duration-200";

  const variantStyles = {
    primary: disabled
      ? "bg-stat-primary-200 text-stat-bg cursor-not-allowed opacity-50"
      : "bg-stat-primary text-stat-old-bg hover:bg-stat-primary-200 active:bg-stat-primary-800",

    secondary: disabled
      ? "bg-stat-font-secondary text-white cursor-not-allowed opacity-50"
      : "bg-stat-font-secondary text-stat-old-bg hover:bg-stat-font-tertiary active:bg-stat-font",

    tertiary: disabled
      ? "bg-transparent text-stat-socondary-font-100 cursor-not-allowed"
      : "bg-transparent text-stat-font hover:bg-stat-primary-50 active:bg-stat-primary-100",

    outline: disabled
      ? "bg-transparent border border-stat-primary-200 text-stat-primary-200 cursor-not-allowed"
      : "bg-transparent border border-stat-primary text-stat-primary hover:bg-stat-primary-50 active:bg-stat-primary-100",
  };

  return React.createElement(
    "button",
    {
      onClick: disabled ? undefined : onClick,
      disabled: disabled,
      className: `${baseStyles} ${variantStyles[variant]} ${className}`,
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
