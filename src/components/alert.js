const React = require("react");
const { MaterialIcon } = require("./button.js");

/**
 * Alert - компонент уведомления об ошибке
 *
 * Упрощённая версия без сложной логики:
 * - Только UI и таймер автозакрытия
 * - Показывает список ошибок валидации
 * - Автоматически закрывается через 5 секунд
 *
 * @param {Object} props
 * @param {string} props.title - заголовок алерта
 * @param {Array<string>} props.errors - массив текстов ошибок
 * @param {Function} props.onClose - callback закрытия алерта
 */
const Alert = ({ title, errors, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  // ============================================================================
  // AUTO-CLOSE TIMER
  // ============================================================================

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Небольшая задержка для завершения анимации fade-out
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      }, 70000); // Автозакрытие через 5 секунд

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isVisible) return null;

  return React.createElement(
    "div",
    {
      className:
        "alert absolute top-0 left-0 w-full bg-stat-error-50 border border-stat-error-100 rounded-md p-3lg shadow-lg transition-opacity duration-300 ease-in-out z-50",
      style: {
        opacity: isVisible ? 1 : 0,
      },
    },
    [
      // Header с иконкой и кнопкой закрытия
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex items-center justify-between mb-2.5",
        },
        [
          // Title с иконкой
          React.createElement(
            "div",
            {
              key: "title-section",
              className: "flex items-center gap-1sm",
            },
            [
              React.createElement(MaterialIcon, {
                key: "info-icon",
                name: "info",
                className: "material-icons-outlined text-stat-error-700",
              }),
              React.createElement(
                "div",
                {
                  key: "title-text",
                  className:
                    "text-stat-error-700 text-base font-bold font-noto",
                },
                title || "Error"
              ),
            ]
          ),

          // Close button
          React.createElement(MaterialIcon, {
            key: "close-btn",
            name: "close",
            className:
              "material-icons-outlined text-stat-error-700 cursor-pointer hover:text-stat-error-800 transition-colors",
            onClick: handleClose,
          }),
        ]
      ),

      // Error list
      React.createElement(
        "ul",
        {
          key: "errors",
          className: "list-disc pl-5 mb-2.5",
        },
        (errors || []).map((error, index) =>
          React.createElement(
            "li",
            {
              key: `error-${index}`,
              className: "text-stat-error-700 text-sm font-noto mb-1",
            },
            error
          )
        )
      ),

      // Footer message
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
