const React = require("react");
const { MaterialIcon } = require("./button.js");

/**
 * Alert - компонент уведомления
 *
 * @param {Object} props
 * @param {'error'|'success'} props.variant - тип алерта (default: 'error')
 * @param {string} props.title   - заголовок алерта
 * @param {string} props.message - текст сообщения (для success)
 * @param {Array<string>} props.errors - список ошибок (для error)
 * @param {Function} props.onClose - callback закрытия
 */
const Alert = ({ variant = "error", title, message, errors, onClose }) => {
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
      }, 5000); // Автозакрытие через 5 секунд

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

  const isSuccess = variant === "success";

  // ── Success variant ────────────────────────────────────────────────────────
  if (isSuccess) {
    return React.createElement(
      "div",
      {
        className: "alert absolute w-[500px] right-0 top-0 rounded-2sm shadow-lg transition-opacity duration-300",
        style: {
          backgroundColor: "#e3fcf4",
          border: "1px solid rgba(0,201,167,0.24)",
          opacity: isVisible ? 1 : 0,
        },
      },
      // Header
      React.createElement(
        "div",
        { className: "flex items-center justify-between px-3md py-3md h-[48px]" },
        React.createElement(
          "div",
          { className: "flex items-center gap-1sm flex-1" },
          React.createElement(MaterialIcon, {
            name: "check_circle",
            className: "material-icons-outlined text-2xl",
            style: { color: "#0a6b4b" },
          }),
          React.createElement(
            "span",
            { className: "font-noto font-semibold text-lg leading-7", style: { color: "#074631" } },
            title || "Fantastic!"
          )
        ),
        React.createElement(MaterialIcon, {
          name: "close",
          className: "material-icons-outlined text-2xl cursor-pointer transition-colors",
          style: { color: "#074631" },
          onClick: handleClose,
        })
      ),
      // Content
      React.createElement(
        "div",
        { className: "pb-3lg px-[40px]" },
        React.createElement(
          "p",
          { className: "font-noto font-normal text-base leading-6", style: { color: "#0a6b4b" } },
          message || "Your report is ready"
        )
      )
    );
  }

  // ── Error variant (default) ────────────────────────────────────────────────
  return React.createElement(
    "div",
    {
      className:
        "alert absolute w-[500px] right-0 top-0 bg-stat-error-50 border border-stat-error-100 rounded-md p-3lg shadow-lg transition-opacity duration-300 ease-in-out",
      style: { opacity: isVisible ? 1 : 0 },
    },
    [
      React.createElement(
        "div",
        { key: "header", className: "flex items-center justify-between mb-2.5" },
        [
          React.createElement(
            "div",
            { key: "title-section", className: "flex items-center gap-1sm" },
            [
              React.createElement(MaterialIcon, {
                key: "info-icon",
                name: "info",
                className: "material-icons-outlined text-stat-error-700",
              }),
              React.createElement(
                "div",
                { key: "title-text", className: "text-stat-error-700 text-base font-bold font-noto" },
                title || "Error"
              ),
            ]
          ),
          React.createElement(MaterialIcon, {
            key: "close-btn",
            name: "close",
            className: "material-icons-outlined text-stat-error-700 cursor-pointer hover:text-stat-error-800 transition-colors",
            onClick: handleClose,
          }),
        ]
      ),
      React.createElement(
        "ul",
        { key: "errors", className: "list-disc pl-5 mb-2.5" },
        (errors || []).map((error, index) =>
          React.createElement(
            "li",
            { key: `error-${index}`, className: "text-stat-error-700 text-sm font-noto mb-1" },
            error
          )
        )
      ),
      React.createElement(
        "div",
        { key: "footer", className: "text-stat-error-700 text-sm font-bold text-center font-noto" },
        "Please try again!"
      ),
    ]
  );
};

module.exports = Alert;
