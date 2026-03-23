const React = require("react");
const { MaterialIcon } = require("../components/button.js");
const { TableView } = require("../components/tableView.js");
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

  // Display mode: 'dashboard' or 'table'
  const [viewMode, setViewMode] = React.useState("dashboard");

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
   * Handler for the "Next step" button
   */
  const handleNextStep = () => {
    console.log("➡️ Moving to next step with selected data:", csvData);
    // TODO: Implement next step logic (e.g., navigate to validation/wizard)
    // show custom alert
    setAlertProps({
      title: "Next Step",
      errors: ["Functionality will be implemented in the next phase"],
    });
    setAlertVisible(true);
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

  // If the table mode is selected, show TableView.
  if (viewMode === "table" && csvData) {
    return React.createElement(TableView, {
      headers: csvData.headers,
      rows: csvData.rows,
      columnTypes: csvData.columnTypes,
      onBack: handleBackToDashboard,
      onNext: handleNextStep,
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
          title: alertProps.title,
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
                    className:
                      "bg-stat-primary flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl hover:bg-stat-primary-600 transition-colors",
                    onClick: handleStartAnalyze,
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

          // Empty state message
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
