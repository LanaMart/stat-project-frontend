const React = require("react");
const { MaterialIcon } = require("./button.js"); // Assuming MaterialIcon is available from button.js

const Alert = ({ title, errors, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(); // Call onClose after animation
      }, 5000); // Auto-close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return React.createElement(
    "div",
    {
      className:
        "absolute top-0 left-0 right-0 w-auto bg-stat-error-50 border border-stat-error-100 rounded-md p-3lg shadow-lg transition-opacity duration-300 ease-in-out",
      style: {
        opacity: isVisible ? 1 : 0, // Fade animation
      },
    },
    [
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex items-center justify-between mb-2.5",
        },
        [
          React.createElement(
            "div",
            { className: "flex items-center gap-1sm" },
            [
              React.createElement(MaterialIcon, {
                name: "info",
                className: "material-icons-outlined text-stat-error-700",
              }),
              React.createElement(
                "div",
                {
                  className:
                    "text-stat-error-700 text-base font-bold font-noto",
                },
                title
              ),
            ]
          ),
          React.createElement(MaterialIcon, {
            name: "close",
            className:
              "material-icons-outlined text-stat-error-700 cursor-pointer hover:text-stat-error-800",
            onClick: handleClose,
          }),
        ]
      ),
      React.createElement(
        "ul",
        {
          key: "errors",
          className: "list-disc pl-5 mb-2.5",
        },
        errors.map((error, index) =>
          React.createElement(
            "li",
            {
              key: `error-${index}`,
              className: "text-stat-error-700 text-sm font-noto",
            },
            error
          )
        )
      ),
      React.createElement(
        "div",
        {
          key: "footer",
          className:
            "text-stat-error-700 text-sm font-bold text-center font-noto",
        },
        "Please try again!"
      ),
    ]
  );
};

module.exports = Alert;
