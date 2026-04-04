const React = require("react");
const { SelectBox } = require("../selectBox");
const { QPushButton, MaterialIcon } = require("../button");
const { apiClient } = require("../apiClient");

/**
 * SelectVariable - Step 2 of 3: variable selection screen
 *
 * @param {Object} props
 * @param {string} props.projectId - Current project ID (used to fetch columns)
 * @param {Function} props.onBack - Back to dashboard
 * @param {Function} props.onPreviousQuestion - Back to DataLearn
 * @param {Function} props.onNextStep - Next step, receives selected column name
 * @param {Function} [props.onReturnToSummary] - When editing from Summary, returns directly to Step 3
 */
const SelectVariable = ({ projectId, onBack, onPreviousQuestion, onNextStep, onReturnToSummary }) => {
  const [selectedColumn, setSelectedColumn] = React.useState(null);

  const fetchOptions = () => apiClient.getColumns(projectId);

  const handleNext = () => {
    if (onNextStep) onNextStep(selectedColumn);
  };

  return React.createElement(
    "div",
    { className: "flex flex-col gap-4xl h-full px-4xl min-h-0 overflow-y-auto" },

    // Header
    React.createElement(
      "p",
      { className: "font-noto font-semibold text-lg leading-7 text-stat-primary shrink-0" },
      "Step 2 of 3: How do we need to analyze your data? Please answer few questions"
    ),

    // Content
    React.createElement(
      "div",
      { className: "flex flex-col gap-3xl w-full shrink-0" },

      React.createElement(
        "p",
        { className: "font-noto font-semibold text-base text-stat-font-secondary" },
        "Select a specific variable you want to explain or predict (",
        React.createElement("span", { className: "text-stat-error-600" }, "*Required"),
        ")"
      ),

      React.createElement(
        "div",
        { className: "w-full max-w-[310px]" },
        React.createElement(SelectBox, {
          fetchOptions,
          value: selectedColumn,
          onChange: setSelectedColumn,
          placeholder: "Select specific column",
        })
      )
    ),

    // Footer buttons
    React.createElement(
      "div",
      { className: "flex items-center justify-between w-full shrink-0 pb-4xl" },

      React.createElement(
        "button",
        {
          type: "button",
          className:
            "flex gap-1sm items-center px-3md py-2sm rounded-sm h-9 hover:bg-stat-font-tertiary transition-colors",
          onClick: onBack,
        },
        React.createElement(MaterialIcon, {
          name: "arrow_back",
          className: "material-icons text-stat-font text-2xl",
        }),
        React.createElement(
          "span",
          { className: "font-noto font-normal text-base text-stat-font whitespace-nowrap" },
          "Back to dashboard"
        )
      ),

      React.createElement(
        "div",
        { className: "flex gap-3md items-center" },
        React.createElement(
          QPushButton,
          { variant: "outline", onClick: onPreviousQuestion },
          "Previous question"
        ),
        React.createElement(
          QPushButton,
          {
            variant: "primary",
            disabled: !selectedColumn,
            onClick: () => {
              if (onReturnToSummary) onReturnToSummary(selectedColumn);
              else handleNext();
            },
          },
          onReturnToSummary ? "Back to summary" : "Next step"
        )
      )
    )
  );
};

module.exports = { SelectVariable };
