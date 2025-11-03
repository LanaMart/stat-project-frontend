const React = require("react");
const { MaterialIcon } = require("../components/button.js");

/**
 * TableView - Компонент для отображения CSV данных в виде таблицы
 *
 * Отображается после интерпретации CSV файла.
 * Включает:
 * - Title: "Step 1: Check your data"
 * - Описание с инструкциями
 * - Таблицу с чекбоксами для выбора колонок
 * - Dropdown для выбора типа данных
 * - Кнопки "Back to dashboard" и "Next"
 *
 * @param {Object} props
 * @param {Array<string>} props.headers - заголовки колонок
 * @param {Array<Object>} props.rows - строки данных
 * @param {Object} props.columnTypes - типы колонок { columnName: 'number|string|boolean|date' }
 * @param {Function} props.onBack - callback для возврата к dashboard
 * @param {Function} props.onNext - callback для перехода к следующему шагу
 * @param {Array<string>} [props.selectedColumns] - выбранные колонки
 * @param {Function} [props.onColumnToggle] - callback для переключения колонки
 * @param {Function} [props.onTypeChange] - callback для изменения типа колонки
 *
 * @example
 * <TableView
 *   headers={['Column A', 'Column B']}
 *   rows={[{ 'Column A': '1', 'Column B': 'test' }]}
 *   columnTypes={{ 'Column A': 'number', 'Column B': 'string' }}
 *   onBack={() => console.log('Back')}
 *   onNext={() => console.log('Next')}
 * />
 */
const TableView = ({
  headers = [],
  rows = [],
  columnTypes = {},
  onBack,
  onNext,
  selectedColumns: initialSelectedColumns,
  onColumnToggle,
  onTypeChange,
}) => {
  // State для выбранных колонок (если не управляется извне)
  const [selectedColumns, setSelectedColumns] = React.useState(
    initialSelectedColumns || headers
  );

  // State для типов колонок
  const [types, setTypes] = React.useState(columnTypes);

  // Обработчик переключения колонки
  const handleColumnToggle = (columnName) => {
    const newSelected = selectedColumns.includes(columnName)
      ? selectedColumns.filter((col) => col !== columnName)
      : [...selectedColumns, columnName];

    setSelectedColumns(newSelected);

    if (onColumnToggle) {
      onColumnToggle(columnName, newSelected);
    }
  };

  // Обработчик изменения типа колонки
  const handleTypeChange = (columnName, newType) => {
    const newTypes = { ...types, [columnName]: newType };
    setTypes(newTypes);

    if (onTypeChange) {
      onTypeChange(columnName, newType);
    }
  };

  // Доступные типы данных
  const dataTypes = ["number", "string", "boolean", "date"];

  // Ограничиваем количество отображаемых строк для производительности
  const displayRows = rows.slice(0, 50);

  return React.createElement(
    "div",
    {
      "className": "flex flex-col gap-3lg w-full",
      "data-component": "TableView",
    },
    [
      // ====================================================================
      // TITLE & DESCRIPTION
      // ====================================================================
      React.createElement(
        "div",
        {
          key: "intro",
          className: "flex flex-col gap-2sm w-full",
        },
        [
          // Title
          React.createElement(
            "p",
            {
              key: "title",
              className:
                "font-noto font-semibold text-lg leading-3xl text-stat-primary",
            },
            "Step 1: Check your data"
          ),

          // Description
          React.createElement(
            "div",
            {
              key: "description",
              className: "flex flex-col gap-2sm rounded-2sm",
            },
            React.createElement(
              "p",
              {
                className:
                  "font-noto font-normal text-base leading-4xl text-stat-font",
              },
              [
                "This is the data you added for analysis. If you want to select only certain columns for analysis, click on the checkbox at the top of each column (",
                React.createElement(
                  "span",
                  {
                    key: "optional",
                    className: "font-bold",
                  },
                  "Optional"
                ),
                ").",
              ]
            )
          ),
        ]
      ),

      // ====================================================================
      // TABLE
      // ====================================================================
      React.createElement(
        "div",
        {
          key: "table-container",
          className:
            "border border-stat-primary-100 rounded-2sm overflow-hidden",
        },
        React.createElement(
          "div",
          {
            className: "flex h-[455px] overflow-auto",
          },
          headers.map((header, colIndex) => {
            const isSelected = selectedColumns.includes(header);

            return React.createElement(
              "div",
              {
                key: `col-${colIndex}`,
                className: "flex flex-col h-full shrink-0",
              },
              [
                // ====== CHECKBOX HEADER ======
                React.createElement(
                  "div",
                  {
                    key: "checkbox-header",
                    className: `bg-white border-stat-primary-50 ${
                      colIndex === 0
                        ? "border-t border-l rounded-tl-2sm"
                        : "border-t border-l"
                    } ${
                      colIndex === headers.length - 1 ? "rounded-tr-2sm" : ""
                    } flex gap-2sm items-center min-w-[120px] max-w-[160px] px-2sm py-1sm`,
                  },
                  React.createElement(
                    "button",
                    {
                      className: "relative shrink-0 size-[24px]",
                      onClick: () => handleColumnToggle(header),
                      type: "button",
                    },
                    isSelected
                      ? // Checked checkbox
                        React.createElement("div", {
                          className:
                            "absolute bg-stat-primary-800 left-[2px] overflow-clip rounded-[3px] size-[20px] top-[2px]",
                          style: {
                            backgroundImage:
                              "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22white%22%3E%3Cpath d=%22M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z%22/%3E%3C/svg%3E')",
                            backgroundSize: "cover",
                          },
                        })
                      : // Unchecked checkbox
                        React.createElement("div", {
                          className:
                            "absolute bg-white border-2 border-stat-primary inset-[8.333%] rounded-[3px]",
                        })
                  )
                ),

                // ====== COLUMN NAME ======
                React.createElement(
                  "div",
                  {
                    key: "column-name",
                    className:
                      "bg-stat-primary-100 border border-stat-primary-50 flex gap-2sm items-center min-w-[120px] max-w-[160px] px-2sm py-2sm",
                  },
                  React.createElement(
                    "p",
                    {
                      className:
                        "font-noto font-semibold text-sm leading-3xl text-stat-font truncate",
                    },
                    header
                  )
                ),

                // ====== DATA TYPE DROPDOWN ======
                React.createElement(
                  "div",
                  {
                    key: "type-dropdown",
                    className:
                      "bg-white border border-stat-primary-50 flex gap-2sm items-center min-w-[120px] max-w-[160px] px-2sm py-2sm",
                  },
                  React.createElement(
                    "div",
                    {
                      className:
                        "border border-stat-font-secondary flex flex-col gap-2sm px-xs py-2xs rounded-xs w-[120px]",
                    },
                    React.createElement(
                      "select",
                      {
                        className:
                          "w-full bg-transparent font-noto font-normal text-sm leading-3xl text-stat-font border-none outline-none cursor-pointer",
                        value: types[header] || "string",
                        onChange: (e) =>
                          handleTypeChange(header, e.target.value),
                      },
                      dataTypes.map((type) =>
                        React.createElement(
                          "option",
                          {
                            key: type,
                            value: type,
                          },
                          type
                        )
                      )
                    )
                  )
                ),

                // ====== DATA ROWS ======
                ...displayRows.map((row, rowIndex) =>
                  React.createElement(
                    "div",
                    {
                      key: `row-${rowIndex}`,
                      className: `bg-white border border-stat-primary-50 flex gap-2sm items-center min-w-[120px] max-w-[160px] px-2sm py-1sm ${
                        rowIndex === displayRows.length - 1 && colIndex === 0
                          ? "rounded-bl-2sm"
                          : ""
                      } ${
                        rowIndex === displayRows.length - 1 &&
                        colIndex === headers.length - 1
                          ? "rounded-br-2sm"
                          : ""
                      }`,
                    },
                    React.createElement(
                      "p",
                      {
                        className:
                          "font-noto font-normal text-sm leading-3xl text-stat-font truncate",
                      },
                      row[header] || ""
                    )
                  )
                ),
              ]
            );
          })
        )
      ),

      // ====================================================================
      // BUTTONS
      // ====================================================================
      React.createElement(
        "div",
        {
          key: "buttons",
          className: "flex items-center justify-between w-full",
        },
        [
          // Back to Dashboard button
          React.createElement(
            "button",
            {
              key: "back-btn",
              className:
                "flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl hover:bg-stat-bg transition-colors",
              onClick: onBack,
              type: "button",
            },
            [
              React.createElement(MaterialIcon, {
                key: "back-icon",
                name: "arrow_back",
                className: "material-icons text-stat-font text-2xl",
              }),
              React.createElement(
                "p",
                {
                  key: "back-text",
                  className:
                    "font-noto font-normal text-base leading-4xl text-stat-font whitespace-nowrap",
                },
                "Back to dashboard"
              ),
            ]
          ),

          // Next button
          React.createElement(
            "button",
            {
              key: "next-btn",
              className:
                "bg-stat-primary flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl hover:bg-stat-primary-600 transition-colors",
              onClick: onNext,
              type: "button",
            },
            React.createElement(
              "p",
              {
                className:
                  "font-noto font-normal text-base leading-4xl text-stat-old-bg whitespace-nowrap",
              },
              "Next step"
            )
          ),
        ]
      ),
    ]
  );
};

module.exports = { TableView };
