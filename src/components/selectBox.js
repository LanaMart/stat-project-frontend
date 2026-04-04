const React = require("react");
const { MaterialIcon } = require("./button");

/**
 * SelectBox - A dropdown select component
 *
 * Supports two modes:
 * 1. Static: pass `options` directly
 * 2. Dynamic: pass `fetchOptions` — async function that returns [{ value, label }]
 *    Options are fetched once when the dropdown is first opened.
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} [props.options] - Static options list
 * @param {Function} [props.fetchOptions] - Async function () => [{ value, label }]
 * @param {string|null} props.value - Currently selected value
 * @param {Function} props.onChange - Called with selected value on change
 * @param {string} props.placeholder - Placeholder text when nothing is selected
 * @param {string} props.className - Additional classes for the wrapper
 */
const SelectBox = ({
  options: staticOptions = [],
  fetchOptions,
  value = null,
  onChange,
  placeholder = "Select specific column",
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState(staticOptions);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState(null);
  const hasFetched = React.useRef(false);
  const containerRef = React.useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? null;

  // Fetch options from backend on first open
  const handleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && fetchOptions && !hasFetched.current) {
        hasFetched.current = true;
        setIsLoading(true);
        setFetchError(null);
        fetchOptions()
          .then((data) => {
            setOptions(data);
            setIsLoading(false);
          })
          .catch((err) => {
            setFetchError(err.message || "Failed to load options");
            setIsLoading(false);
          });
      }
      return next;
    });
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (onChange) onChange(optionValue);
    setIsOpen(false);
  };

  const renderDropdownContent = () => {
    if (isLoading) {
      return React.createElement(
        "div",
        { className: "flex items-center justify-center py-3md" },
        React.createElement("div", {
          className: "animate-spin rounded-full h-5 w-5 border-b-2 border-stat-primary",
        })
      );
    }

    if (fetchError) {
      return React.createElement(
        "p",
        { className: "font-noto text-xs text-stat-error-700 px-1sm py-3md" },
        fetchError
      );
    }

    if (options.length === 0) {
      return React.createElement(
        "p",
        { className: "font-noto text-sm text-stat-font-secondary px-1sm py-3md" },
        "No options available"
      );
    }

    return options.map((option) => {
      const isSelected = option.value === value;
      return React.createElement(
        "div",
        {
          key: option.value,
          className: `flex items-center justify-between px-1sm py-3md rounded cursor-pointer ${
            isSelected ? "bg-stat-primary-50" : "hover:bg-stat-bg"
          }`,
          onClick: () => handleSelect(option.value),
        },
        React.createElement(
          "span",
          { className: "font-noto font-normal text-sm leading-5 text-stat-font flex-1 min-w-0" },
          option.label
        ),
        isSelected &&
          React.createElement(MaterialIcon, {
            name: "check",
            className: "material-icons text-stat-primary text-2xl shrink-0",
          })
      );
    });
  };

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: `flex flex-col items-start w-full max-w-[310px] relative ${className}`,
    },

    // Trigger box
    React.createElement(
      "button",
      {
        type: "button",
        className:
          "bg-stat-white border border-stat-primary-50 rounded-2sm flex items-center justify-between px-2sm py-3md w-full",
        onClick: handleOpen,
      },
      React.createElement(
        "span",
        {
          className: `font-noto font-normal text-sm leading-5 flex-1 text-left ${
            selectedLabel ? "text-stat-font" : "text-stat-font-secondary"
          }`,
        },
        selectedLabel ?? placeholder
      ),
      React.createElement(MaterialIcon, {
        name: isOpen ? "arrow_drop_up" : "arrow_drop_down",
        className: "material-icons text-stat-font-secondary text-2xl shrink-0",
      })
    ),

    // Dropdown list
    isOpen &&
      React.createElement(
        "div",
        {
          className:
            "bg-stat-white border border-stat-primary-50 rounded-2sm flex flex-col gap-2xs px-3md py-2sm w-full max-h-[220px] overflow-y-auto absolute left-0 z-dropdown shadow-md",
          style: { top: "calc(100% + 8px)" },
        },
        renderDropdownContent()
      )
  );
};

module.exports = { SelectBox };
