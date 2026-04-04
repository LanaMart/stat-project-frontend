const React = require("react");
const { Question } = require("../question");
const { QPushButton, MaterialIcon } = require("../button");

const QUESTIONS = [
  {
    id: "correlation",
    title: "Understand how one thing affects another",
    description:
      "Find out if there's a connection between different metrics in your data",
    example:
      "Example: Does salary depend on education? Does temperature affect ice cream sales?",
  },
  {
    id: "prediction",
    title: "Predict what will happen in the future",
    description: "Forecast future values based on your existing data",
    example:
      "Example: How much inventory should we order next month? What will website traffic be?",
  },
  {
    id: "comparison",
    title: "Compare different groups",
    description: "Find differences between categories or groups in your data",
    example:
      "Example: Who buys more - men or women? Which branch performs better?",
  },
  {
    id: "anomaly",
    title: "Find unusual cases",
    description:
      "Detect data points that are significantly different from the rest",
    example:
      "Example: Which customers spend suspiciously much? Which days were unusually profitable?",
  },
  {
    id: "patterns",
    title: "Discover hidden patterns",
    description: "Uncover non-obvious groups or connections in your data",
    example:
      "Example: Which purchases are often made together? Are there customer types with similar behavior?",
  },
  {
    id: "trends",
    title: "See how things change over time",
    description: "Track changes in metrics over time periods",
    example:
      "Example: Are sales growing each month? What time of day has the most orders?",
  },
];

/**
 * DataLearn - Step 2 of 3: question selection screen
 *
 * @param {Object} props
 * @param {Function} props.onBack - Back to dashboard
 * @param {Function} props.onPreviousStep - Previous step
 * @param {Function} props.onNextStep - Next step, receives selected question object
 * @param {Function} [props.onReturnToSummary] - When editing from Summary, returns directly to Step 3
 */
const DataLearn = ({ onBack, onPreviousStep, onNextStep, onReturnToSummary }) => {
  const [selectedId, setSelectedId] = React.useState(null);

  const handleNext = () => {
    const question = QUESTIONS.find((q) => q.id === selectedId);
    if (onNextStep) onNextStep(question);
  };

  return React.createElement(
    "div",
    {
      className:
        "flex flex-col gap-4xl w-full h-full px-4xl min-h-0 overflow-y-auto",
    },

    // Header
    React.createElement(
      "p",
      {
        className:
          "font-noto font-semibold text-lg leading-7 text-stat-primary shrink-0",
      },
      "Step 2 of 3: How do we need to analyze your data? Please answer few questions",
    ),

    // Questions section
    React.createElement(
      "div",
      { className: "flex flex-col gap-3xl w-full shrink-0" },

      // Question label
      React.createElement(
        "p",
        {
          className:
            "font-noto font-semibold text-base text-stat-font-secondary",
        },
        "What do you want to learn from your data? (",
        React.createElement(
          "span",
          { className: "text-stat-error-600" },
          "*Required",
        ),
        ")",
      ),

      // Questions list
      React.createElement(
        "div",
        { className: "flex flex-col gap-2sm w-full" },
        ...QUESTIONS.map((q) =>
          React.createElement(Question, {
            key: q.id,
            title: q.title,
            description: q.description,
            example: q.example,
            selected: selectedId === q.id,
            onClick: () => setSelectedId(q.id),
          }),
        ),
      ),
    ),

    // Footer buttons
    React.createElement(
      "div",
      { className: "flex items-center justify-between w-full shrink-0 pb-4xl" },

      // Back to dashboard
      React.createElement(
        "button",
        {
          className:
            "flex gap-1sm items-center px-3md py-2sm rounded-sm h-9 hover:bg-stat-font-tertiary transition-colors",
          onClick: onBack,
          type: "button",
        },
        React.createElement(MaterialIcon, {
          name: "arrow_back",
          className: "material-icons text-stat-font text-2xl",
        }),
        React.createElement(
          "span",
          {
            className:
              "font-noto font-normal text-base text-stat-font whitespace-nowrap",
          },
          "Back to dashboard",
        ),
      ),

      // Right buttons
      React.createElement(
        "div",
        { className: "flex gap-3md items-center" },

        React.createElement(
          QPushButton,
          { variant: "outline", onClick: onPreviousStep },
          "Previous step",
        ),

        React.createElement(
          QPushButton,
          {
            variant: "primary",
            disabled: !selectedId,
            onClick: () => {
              const question = QUESTIONS.find((q) => q.id === selectedId);
              if (onReturnToSummary) onReturnToSummary(question);
              else handleNext();
            },
          },
          onReturnToSummary ? "Back to summary" : "Next step",
        ),
      ),
    ),
  );
};

module.exports = { DataLearn };
