const React = require("react");
const { Badge } = require("../badge");
const { QPushButton, MaterialIcon } = require("../button");

/**
 * Summary - Step 3 of 3: review screen
 *
 * @param {Object} props
 * @param {string[]} props.selectedColumns - Business critical columns (from TableView checkboxes)
 * @param {{ id, title, description, example }} props.selectedQuestion - Answer from Questionnaire
 * @param {string} props.selectedVariable - Column chosen in SelectVariable
 * @param {Function} props.onBack - Back to dashboard
 * @param {Function} props.onEditColumns - Edit icon for business critical box → back to table
 * @param {Function} props.onEditQuestion - Edit icon for question box → back to questionnaire
 * @param {Function} props.onEditVariable - Edit icon for variable box → back to selectVariable
 * @param {Function} props.onColumnRemove - Called with column name when badge × is clicked
 * @param {Function} props.onPrepareReport - "Prepare the report" button handler
 */
const Summary = ({
  selectedColumns = [],
  selectedQuestion = null,
  selectedVariable = null,
  onBack,
  onEditColumns,
  onEditQuestion,
  onEditVariable,
  onColumnRemove,
  onPrepareReport,
}) => {
  const [columns, setColumns] = React.useState(selectedColumns);

  const handleRemove = (col) => {
    const next = columns.filter((c) => c !== col);
    setColumns(next);
    if (onColumnRemove) onColumnRemove(col);
  };

  // Reusable section wrapper
  const SectionBox = ({ children }) =>
    React.createElement(
      "div",
      {
        className:
          "bg-stat-primary-50 border border-stat-primary-100 rounded-2sm flex flex-col gap-3lg items-start pt-1sm pb-3lg px-3lg w-full shrink-0",
      },
      children,
    );

  // Reusable section header with edit button
  const SectionHeader = ({ title, subtitle, onEdit }) =>
    React.createElement(
      "div",
      { className: "flex items-center justify-between w-full" },
      React.createElement(
        "p",
        { className: "font-noto font-bold text-base text-stat-font" },
        title,
        subtitle,
      ),
      React.createElement(
        "button",
        {
          "type": "button",
          "className":
            "flex items-center justify-center w-[40px] h-[40px] p-1sm rounded-sm hover:bg-stat-primary-100 transition-colors cursor-pointer",
          "onClick": onEdit,
          "aria-label": "Edit",
        },
        React.createElement(MaterialIcon, {
          name: "edit",
          className: "material-icons text-stat-primary text-2xl",
        }),
      ),
    );

  return React.createElement(
    "div",
    {
      className:
        "flex flex-col gap-3lg w-full h-full px-4xl min-h-0 overflow-y-auto",
    },

    // Header
    React.createElement(
      "p",
      {
        className:
          "font-noto font-semibold text-lg leading-7 text-stat-primary shrink-0",
      },
      "Step 3 of 3: Please check your choice",
    ),

    // ── Box 1: Business critical information ──────────────────────────────
    React.createElement(
      SectionBox,
      null,
      React.createElement(SectionHeader, {
        title: React.createElement(
          "span",
          null,
          React.createElement(
            "span",
            { className: "font-bold" },
            "Business critical information ",
          ),
          React.createElement("span", { className: "font-normal" }, "("),
          React.createElement(
            "span",
            { className: "font-normal text-stat-font-secondary" },
            "optional",
          ),
          React.createElement("span", { className: "font-normal" }, ")"),
        ),
        onEdit: onEditColumns,
      }),
      columns.length > 0
        ? React.createElement(
            "div",
            { className: "flex flex-wrap gap-2sm" },
            ...columns.map((col) =>
              React.createElement(Badge, {
                key: col,
                label: col,
                onRemove: () => handleRemove(col),
              }),
            ),
          )
        : React.createElement(
            "p",
            { className: "font-noto text-sm text-stat-font-secondary" },
            "No columns selected",
          ),
    ),

    // ── Box 2: What do you want to learn ─────────────────────────────────
    React.createElement(
      SectionBox,
      null,
      React.createElement(SectionHeader, {
        title: "What do you want to learn from your data",
        onEdit: onEditQuestion,
      }),
      selectedQuestion
        ? React.createElement(
            "div",
            {
              className:
                "bg-stat-white border border-stat-primary-50 rounded-2sm flex flex-col gap-3md px-3lg py-3md w-full",
            },
            React.createElement(
              "span",
              { className: "font-noto font-normal text-base text-stat-font" },
              selectedQuestion.title,
            ),
            React.createElement(
              "div",
              { className: "flex flex-col gap-xs" },
              selectedQuestion.description &&
                React.createElement(
                  "p",
                  { className: "font-noto text-sm text-stat-font m-0" },
                  selectedQuestion.description,
                ),
              selectedQuestion.example &&
                React.createElement(
                  "p",
                  { className: "font-noto text-xs text-stat-primary m-0" },
                  selectedQuestion.example,
                ),
            ),
          )
        : React.createElement(
            "p",
            { className: "font-noto text-sm text-stat-font-secondary" },
            "No question selected",
          ),
    ),

    // ── Box 3: Specific variable ──────────────────────────────────────────
    React.createElement(
      SectionBox,
      null,
      React.createElement(SectionHeader, {
        title: "Specific variable you want to explain or predict",
        onEdit: onEditVariable,
      }),
      selectedVariable
        ? React.createElement(Badge, { label: selectedVariable })
        : React.createElement(
            "p",
            { className: "font-noto text-sm text-stat-font-secondary" },
            "No variable selected",
          ),
    ),

    // ── Footer buttons ────────────────────────────────────────────────────
    React.createElement(
      "div",
      { className: "flex items-center justify-between w-full shrink-0 pb-4xl" },

      // Back to dashboard
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
          {
            className:
              "font-noto font-normal text-base text-stat-font whitespace-nowrap",
          },
          "Back to dashboard",
        ),
      ),

      // Prepare the report
      React.createElement(
        QPushButton,
        { variant: "primary", onClick: onPrepareReport },
        "Prepare the report",
      ),
    ),
  );
};

module.exports = { Summary };
