const React = require("react");
const { MaterialIcon } = require("../components/button.js");
const { TableView } = require("./wizard/tableView.js");
const { DataLearn } = require("./wizard/DataLearn.js");
const { SelectVariable } = require("./wizard/selectVariable.js");
const { Summary } = require("./wizard/summary.js");
const { WaitingScreen } = require("./wizard/waitingScreen.js");
const { parseCSV, validateParsedData } = require("../utils/csvParser.js");
const { apiClient } = require("../components/apiClient.js");
const Alert = require("../components/alert.js"); // Импорт Alert компонента
const { useProject } = require("../context/projectContext.js"); // Импорт useProject

/**
 * YourDataDashboard - a dashboard component with data viewing capabilities
 *
 * Supports two modes:
 * 1. Dashboard view - displays information about the uploaded file
 * 2. Table view - displays interpreted CSV data in a table
 *
 * @param {Object} props
 * @param {string} props.projectId
 * @param {string} props.projectName
 * @param {string} props.fileName
 * @param {Function} [props.onAddFile] - callback for adding a new file
 * @param {Function} [props.onDownloadFile] - callback for file download
 * @param {Function} [props.onDeleteFile] - callback for delete the file
 *
 * @example
 * <YourDataDashboard
 *   projectId="project_123"
 *   projectName="My Project"
 *   fileName="Coffee_profit.csv"
 * />
 */

const YourDataDashboard = ({
  projectId,
  projectName,
  fileName,
  onAddFile,
  onDownloadFile,
  onDeleteFile,
}) => {
  // ============================================================================
  // STATE
  // ============================================================================

  // Display mode: 'dashboard' | 'table' | 'questionnaire' | 'selectVariable'
  const [viewMode, setViewMode] = React.useState("dashboard");

  // Tracks which box was opened for editing from Summary ('columns'|'question'|'variable'|null)
  const [editSource, setEditSource] = React.useState(null);

  // Checked columns from TableView (business critical)
  const [selectedColumns, setSelectedColumns] = React.useState([]);

  // Full question object from DataLearn
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);

  // Selected variable from SelectVariable
  const [selectedVariable, setSelectedVariable] = React.useState(null);

  // Generated report (set after WaitingScreen completes)
  const [report, setReport] = React.useState(null);

  // CSV data after parsing
  const [csvData, setCsvData] = React.useState(null);

  // Loading/parsing state
  const [isLoading, setIsLoading] = React.useState(false);

  // Parsing errors
  const [parseError, setParseError] = React.useState(null);

  // Status for Alert
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertProps, setAlertProps] = React.useState({ title: "", errors: [] });

  // Status for Alert
  const { userId } = useProject();

  // ============================================================================
  // CSV INTERPRETATION
  // ============================================================================

  /**
   * Interprets a CSV file and switches to table mode.
   */
  const interpretCSV = async () => {
    try {
      setIsLoading(true);
      setParseError(null);

      // Getting a file from the backend
      const fileBlob = await apiClient.downloadProjectFile(userId, projectId, fileName);

      // CSV parcing
      const parsedData = await parseCSV(fileBlob);

      // data validation
      const validation = validateParsedData(parsedData);

      if (!validation.valid) {
        throw new Error(validation.errors.join(", "));
      }

      // Save the data and switch to table mode.
      setCsvData(parsedData);
      setViewMode("table");

      console.log("✅ CSV interpreted successfully:", {
        rows: parsedData.totalRows,
        columns: parsedData.totalColumns,
      });
    } catch (error) {
      console.error("❌ CSV interpretation error:", error);
      setParseError(error.message);

      // show the custom alter
      setAlertProps({
        title: "Failed to interpret CSV",
        errors: [
          error.message ||
            "File lost after restart in mock-backend — please re-upload",
        ],
      });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handler for the "Start data analyze" button
   */
  const handleStartAnalyze = () => {
    console.log("🔍 Starting CSV interpretation...");
    interpretCSV();
  };

  /**
   * Handler for the "View file" button
   */
  const handleViewFile = () => {
    console.log("👁️ Viewing file...");
    interpretCSV();
  };

  /**
   * Handler for the "Back to dashboard" button
   */
  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    setCsvData(null);
    setParseError(null);
  };

  /**
   * Handler for the "Next step" button from TableView
   * Receives checked columns (business critical)
   */
  const handleNextStep = (checkedColumns = []) => {
    console.log("➡️ Moving to questionnaire step. Checked columns:", checkedColumns);
    setSelectedColumns(checkedColumns);
    setViewMode("questionnaire");
  };

  /**
   * download handler
   */
  const handleDownload = async () => {
    if (onDownloadFile) {
      onDownloadFile();
      return;
    }

    try {
      const fileBlob = await apiClient.downloadProjectFile(projectId);
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      // Показываем Alert
      setAlertProps({
        title: "Download Failed",
        errors: ["Failed to download file"],
      });
      setAlertVisible(true);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // If it loads, we show an indicator.
  if (isLoading) {
    return React.createElement(
      "div",
      {
        className:
          "flex flex-col gap-4xl w-full px-4xl flex-1 items-center justify-center",
      },
      [
        React.createElement("div", {
          key: "spinner",
          className:
            "animate-spin rounded-full h-12 w-12 border-b-2 border-stat-primary",
        }),
        React.createElement(
          "p",
          {
            key: "loading-text",
            className: "font-noto text-base text-stat-font",
          },
          "Interpreting CSV data..."
        ),
      ]
    );
  }

  // If questionnaire mode is selected, show DataLearn.
  if (viewMode === "questionnaire") {
    return React.createElement(DataLearn, {
      onBack: handleBackToDashboard,
      onPreviousStep: () => setViewMode("table"),
      onNextStep: (question) => {
        console.log("✅ DataLearn answer:", question);
        setSelectedQuestion(question);
        setViewMode("selectVariable");
      },
      ...(editSource === "question" ? {
        onReturnToSummary: (question) => {
          setSelectedQuestion(question);
          setEditSource(null);
          setViewMode("summary");
        },
      } : {}),
    });
  }

  // If selectVariable mode is selected, show SelectVariable.
  if (viewMode === "waiting") {
    return React.createElement(WaitingScreen, {
      onBack: handleBackToDashboard,
      onComplete: () => {
        setReport({
          name: "Business report",
          description: "Only necessary information, interpretation and prognoses that are important for your business",
          projectName: fileName,
        });
        setViewMode("dashboard");
        setAlertProps({ variant: "success", title: "Fantastic!", message: "Your report is ready" });
        setAlertVisible(true);
      },
    });
  }

  if (viewMode === "summary") {
    return React.createElement(Summary, {
      selectedColumns,
      selectedQuestion,
      selectedVariable,
      onBack: handleBackToDashboard,
      onEditColumns: () => { setEditSource("columns"); setViewMode("table"); },
      onEditQuestion: () => { setEditSource("question"); setViewMode("questionnaire"); },
      onEditVariable: () => { setEditSource("variable"); setViewMode("selectVariable"); },
      onColumnRemove: (col) =>
        setSelectedColumns((prev) => prev.filter((c) => c !== col)),
      onPrepareReport: () => {
        console.log("🚀 Preparing report...", { selectedColumns, selectedQuestion, selectedVariable });
        setViewMode("waiting");
      },
    });
  }

  if (viewMode === "selectVariable") {
    return React.createElement(SelectVariable, {
      projectId,
      onBack: handleBackToDashboard,
      onPreviousQuestion: () => setViewMode("questionnaire"),
      onNextStep: (columnName) => {
        console.log("✅ Selected variable:", columnName);
        setSelectedVariable(columnName);
        setViewMode("summary");
      },
      ...(editSource === "variable" ? {
        onReturnToSummary: (columnName) => {
          setSelectedVariable(columnName);
          setEditSource(null);
          setViewMode("summary");
        },
      } : {}),
    });
  }

  // If the table mode is selected, show TableView.
  if (viewMode === "table" && csvData) {
    return React.createElement(TableView, {
      headers: csvData.headers,
      rows: csvData.rows,
      columnTypes: csvData.columnTypes,
      onBack: handleBackToDashboard,
      onNext: handleNextStep,
      ...(editSource === "columns" ? {
        onReturnToSummary: (cols) => {
          setSelectedColumns(cols);
          setEditSource(null);
          setViewMode("summary");
        },
      } : {}),
    });
  }
  // Otherwise, show the Dashboard view
  return React.createElement(
    "div",
    {
      "className": "flex flex-col gap-4xl w-full h-full px-4xl min-h-0",
      "data-component": "YourDataDashboard",
    },
    [
      // Alert component visible
      alertVisible &&
        React.createElement(Alert, {
          key: "custom-alert",
          variant: alertProps.variant || "error",
          title: alertProps.title,
          message: alertProps.message,
          errors: alertProps.errors,
          onClose: () => setAlertVisible(false),
        }),

      // ====================================================================
      // DASHBOARD HEADER
      // ====================================================================
      React.createElement(
        "div",
        {
          key: "dashboard-header",
          className: "flex items-center justify-between w-full",
        },
        [
          // Title "Your Data Dashboard"
          React.createElement(
            "p",
            {
              key: "title",
              className:
                "font-noto font-semibold text-lg leading-4xl text-stat-primary whitespace-nowrap",
            },
            "Your Data Dashboard"
          ),

          // "Add another data-file" button
          React.createElement(
            "button",
            {
              key: "add-file-btn",
              className:
                "flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl hover:bg-stat-font-tertiary",
              onClick: onAddFile,
              type: "button",
            },
            [
              React.createElement(MaterialIcon, {
                key: "upload-icon",
                name: "upload",
                className: "material-icons-outlined text-stat-font text-2xl",
              }),
              React.createElement(
                "p",
                {
                  key: "btn-text",
                  className:
                    "font-noto font-normal text-base leading-4xl text-stat-font whitespace-nowrap",
                },
                "Add another data-file"
              ),
            ]
          ),
        ]
      ),

      // ====================================================================
      // UPLOADED ROW-DATA SECTION
      // ====================================================================
      React.createElement(
        "div",
        {
          key: "uploaded-data",
          className:
            "bg-stat-primary-50 border border-stat-primary-100 rounded-2sm p-3lg flex flex-col gap-3lg w-full",
        },
        [
          // Section Title
          React.createElement(
            "div",
            {
              key: "section-title",
              className: "flex flex-col gap-2sm h-4xl w-full",
            },
            React.createElement(
              "p",
              {
                className:
                  "font-noto font-bold text-base leading-4xl text-stat-font",
              },
              "Uploaded Row-Data"
            )
          ),

          // File Card
          React.createElement(
            "div",
            {
              key: "file-card",
              className:
                "fileCard bg-white border border-stat-primary-50 rounded-2sm p-3lg flex flex-col gap-3md w-full",
            },
            [
              // File line with actions
              React.createElement(
                "div",
                {
                  key: "file-line",
                  className:
                    "fileLine flex items-center justify-between w-full",
                },
                [
                  // File name with icon
                  React.createElement(
                    "div",
                    {
                      key: "file-info",
                      className: "flex gap-1sm items-center",
                    },
                    [
                      React.createElement(MaterialIcon, {
                        key: "chart-icon",
                        name: "insert_chart_outlined",
                        className:
                          "material-icons-outlined text-stat-primary text-2xl",
                      }),
                      React.createElement(
                        "p",
                        {
                          key: "filename",
                          className:
                            "font-noto font-bold text-base leading-4xl text-stat-primary whitespace-nowrap",
                        },
                        fileName || "Coffee_profit.csv"
                      ),
                    ]
                  ),

                  // Action buttons
                  React.createElement(
                    "div",
                    {
                      key: "actions",
                      className: "flex gap-1sm items-center",
                    },
                    [
                      // View button
                      React.createElement(
                        "button",
                        {
                          "key": "view-btn",
                          "className":
                            "flex items-center border border-stat-primary-50 p-xs w-[36px] h-[36px] items-center rounded-sm hover:bg-stat-bg transition-colors",
                          "onClick": handleViewFile,
                          "type": "button",
                          "aria-label": "View file",
                        },
                        React.createElement(MaterialIcon, {
                          name: "remove_red_eye",
                          className:
                            "material-icons-outlined text-stat-font-secondary text-2xl",
                        })
                      ),

                      // Download button
                      React.createElement(
                        "button",
                        {
                          "key": "download-btn",
                          "className":
                            "flex items-center border border-stat-primary-50 p-xs w-[36px] h-[36px] items-center rounded-sm hover:bg-stat-bg transition-colors",
                          "onClick": handleDownload,
                          "type": "button",
                          "aria-label": "Download file",
                        },
                        React.createElement(MaterialIcon, {
                          name: "download",
                          className:
                            "material-icons-outlined text-stat-font-secondary text-2xl",
                        })
                      ),

                      // Delete button
                      React.createElement(
                        "button",
                        {
                          "key": "delete-btn",
                          "className":
                            "flex items-center border border-stat-primary-50 p-xs w-[36px] h-[36px] rounded-sm hover:bg-stat-bg transition-colors",
                          "onClick": onDeleteFile,
                          "type": "button",
                          "aria-label": "Delete file",
                        },
                        React.createElement(MaterialIcon, {
                          name: "delete",
                          className:
                            "material-icons-outlined text-stat-font-secondary text-2xl",
                        })
                      ),
                    ]
                  ),
                ]
              ),
              // Start analyze button
              React.createElement(
                "div",
                {
                  key: "analyze-btn-container",
                  className: "analyzeButton flex flex-col items-start w-full",
                },
                React.createElement(
                  "button",
                  {
                    className: report
                      ? "bg-stat-primary-200 flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl cursor-not-allowed opacity-50"
                      : "bg-stat-primary flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl hover:bg-stat-primary-600 transition-colors",
                    onClick: report ? undefined : handleStartAnalyze,
                    disabled: !!report,
                    type: "button",
                  },
                  [
                    React.createElement(MaterialIcon, {
                      key: "arrow-icon",
                      name: "arrow_forward",
                      className: "material-icons text-stat-old-bg text-2xl",
                    }),
                    React.createElement(
                      "p",
                      {
                        key: "btn-text",
                        className:
                          "font-noto font-normal text-base leading-4xl text-stat-old-bg whitespace-nowrap",
                      },
                      "Start data analyze"
                    ),
                  ]
                )
              ),
            ]
          ),
        ]
      ),

      // ====================================================================
      // REPORTS SECTION
      // ====================================================================
      React.createElement(
        "div",
        {
          key: "reports",
          className:
            "bg-stat-primary-50 border border-stat-primary-100 rounded-2sm p-3lg flex flex-col gap-3lg w-full",
        },
        [
          // Section Title
          React.createElement(
            "div",
            {
              key: "section-title",
              className: "flex flex-col gap-2sm h-4xl w-full",
            },
            React.createElement(
              "p",
              {
                className:
                  "font-noto font-bold text-base leading-4xl text-stat-font",
              },
              "Reports"
            )
          ),

          report
            ? // Report card
              React.createElement(
                "div",
                {
                  key: "report-card",
                  className:
                    "bg-stat-white border border-stat-primary-50 rounded-2sm flex flex-col gap-3md p-3lg w-full",
                },
                // Top row: project name badge + action buttons
                React.createElement(
                  "div",
                  { className: "flex items-center justify-between w-full" },
                  React.createElement(
                    "span",
                    { className: "bg-stat-primary-50 font-noto text-sm text-stat-font-secondary px-2xs py-2xs rounded" },
                    report.projectName || fileName
                  ),
                  React.createElement(
                    "div",
                    { className: "flex gap-1sm items-center" },
                    ...[
                      { icon: "remove_red_eye", label: "View",     onClick: undefined },
                      { icon: "download",       label: "Download", onClick: undefined },
                      { icon: "delete",         label: "Delete",   onClick: () => setReport(null) },
                    ].map(({ icon, label, onClick }) =>
                      React.createElement(
                        "button",
                        {
                          key: icon,
                          type: "button",
                          "aria-label": label,
                          onClick,
                          className:
                            "border border-stat-primary-50 flex items-center p-xs w-[36px] h-[36px] rounded-sm hover:bg-stat-bg transition-colors",
                        },
                        React.createElement(MaterialIcon, {
                          name: icon,
                          className: "material-icons-outlined text-stat-font-secondary text-2xl",
                        })
                      )
                    )
                  )
                ),
                // Report name
                React.createElement(
                  "div",
                  { className: "flex gap-1sm items-center" },
                  React.createElement(MaterialIcon, {
                    name: "insert_chart_outlined",
                    className: "material-icons-outlined text-stat-primary text-2xl",
                  }),
                  React.createElement(
                    "span",
                    { className: "font-noto font-bold text-base text-stat-primary" },
                    report.name
                  )
                ),
                // Description
                React.createElement(
                  "p",
                  { className: "font-noto font-normal text-base text-stat-font" },
                  report.description
                )
              )
            : // Empty state
              React.createElement(
                "div",
                {
                  key: "empty-message",
                  className: "flex items-center w-full",
                },
                React.createElement(
                  "p",
                  {
                    className:
                      "font-noto font-semibold text-sm leading-3xl text-stat-font-secondary whitespace-nowrap",
                  },
                  "There is no done reports yet. Please start the data analyze"
                )
              ),
        ]
      ),

      // Parsing errors
      parseError &&
        React.createElement(
          "div",
          {
            key: "parse-error",
            className:
              "bg-stat-error-50 border border-stat-error-200 rounded-2sm p-3lg",
          },
          React.createElement(
            "p",
            {
              className: "font-noto text-sm text-stat-error-700",
            },
            `Error: ${parseError}`
          )
        ),
    ]
  );
};

module.exports = { YourDataDashboard };
