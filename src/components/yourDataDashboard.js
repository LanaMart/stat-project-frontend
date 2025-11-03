const React = require("react");
const { MaterialIcon } = require("../components/button.js");

/**
 * YourDataDashboard - a dashboard component with uploaded data.
 *
 * Displayed after the file has been successfully uploaded to the project.
 * Displays information about the uploaded file, the data section, and reports.
 *
 *
 * @param {Object} props
 * @param {string} props.projectName
 * @param {string} props.fileName - name of the downloaded file
 * @param {Function} [props.onAddFile] - callback for adding a new file.
 * @param {Function} [props.onViewFile] - callback for viewing the file
 * @param {Function} [props.onDownloadFile] - callback for downloading the file
 * @param {Function} [props.onDeleteFile] - callback for deleting a file
 * @param {Function} [props.onStartAnalyze] - callback to start data analysis
 *
 * @example
 * <YourDataDashboard
 *   projectName="My Project"
 *   fileName="Coffee_profit.csv"
 *   onStartAnalyze={() => console.log('Start analyze')}
 * />
 */
const YourDataDashboard = ({
  projectName,
  fileName,
  onAddFile,
  onViewFile,
  onDownloadFile,
  onDeleteFile,
  onStartAnalyze,
}) => {
  return React.createElement(
    "div",
    {
      "className": "flex flex-col gap-4xl w-full px-4xl flex-1",
      "data-component": "YourDataDashboard",
    },
    [
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
                "flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl hover:bg-stat-bg transition-colors",
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
                        fileName || "Coffee_ptofit.csv"
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
                          "onClick": onViewFile,
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
                            "flex items-center border border-stat-primary-50 p-xs p-xs w-[36px] h-[36px] items-center rounded-sm hover:bg-stat-bg transition-colors",
                          "onClick": onDownloadFile,
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
                            "flex items-center border border-stat-primary-50 p-xs p-xs w-[36px] h-[36px] rounded-sm hover:bg-stat-bg transition-colors",
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
                  className: " analyzeButton flex flex-col items-start w-full",
                },
                React.createElement(
                  "button",
                  {
                    className:
                      "bg-stat-primary flex gap-1sm items-center px-3md py-2sm rounded-sm h-6xl hover:bg-stat-primary-600 transition-colors",
                    onClick: onStartAnalyze,
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
    ]
  );
};

module.exports = { YourDataDashboard };
