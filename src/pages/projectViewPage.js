const React = require("react");
const { MaterialIcon } = require("../components/button.js");
const { useRouter } = require("../router/router.js");
const {
  useProject,
  PROJECT_STATES,
  UPLOAD_STATES,
} = require("../context/projectContext.js");
const {
  DragDropZone,
  UploadProgress,
  ProcessingMessage,
} = require("../components/upload.js");

// Placeholder for the table (in INTERPRETATION state)
const DataTablePlaceholder = ({ projectName }) => {
  return React.createElement(
    "div",
    {
      className:
        "bg-white border border-stat-primary-50 rounded-md p-3lg w-[600px] flex flex-col items-center gap-3md",
    },
    [
      React.createElement(MaterialIcon, {
        key: "table-icon",
        name: "table_chart",
        className: "material-icons-outlined text-stat-primary text-4xl",
      }),
      React.createElement(
        "h4",
        {
          className:
            "text-stat-font text-lg font-semibold text-center font-noto",
        },
        `Here will be the table of the project "${projectName}"`
      ),
      React.createElement(
        "p",
        {
          className: "text-stat-font-secondary text-sm text-center font-noto",
        },
        "Data visualization coming soon…"
      ),
    ]
  );
};

// Main component of the project page
const ProjectViewPage = ({ project }) => {
  const { navigate } = useRouter();
  const { state, cancelUpload } = useProject();

  // Checking the project from routeParams (without global LS)
  if (!project || !project.id) {
    return React.createElement(
      "div",
      { className: "flex flex-col items-center justify-center gap-4 h-full" },
      React.createElement(
        "div",
        { className: "text-stat-font text-base text-center font-noto" },
        "Project not found"
      )
    );
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  // The DragDropZone is only shown in UPLOAD or RESULT mode.
  const showDragDropZone =
    state.projectState === PROJECT_STATES.UPLOAD ||
    state.projectState === PROJECT_STATES.RESULT;

  // Additional content
  let additionalContent = null;

  if (state.projectState === PROJECT_STATES.UPLOAD) {
    const showUploadProgress =
      state.uploadSubState === UPLOAD_STATES.UPLOADING ||
      state.uploadSubState === UPLOAD_STATES.SUCCESS;

    const showProcessing = state.uploadSubState === UPLOAD_STATES.PROCESSING;

    if (showUploadProgress) {
      additionalContent = React.createElement(UploadProgress, {
        key: "upload-progress",
        fileName: state.currentFile?.name,
        fileSize: state.currentFile?.size,
        uploadState: state.uploadSubState,
        progress: state.progress,
        onCancel: cancelUpload,
        processingTimeEstimate: state.processingTimeEstimate,
      });
    } else if (showProcessing) {
      additionalContent = React.createElement(ProcessingMessage, {
        key: "processing-message",
      });
    }
  } else if (state.projectState === PROJECT_STATES.INTERPRETATION) {
    additionalContent = React.createElement(DataTablePlaceholder, {
      key: "data-placeholder",
      projectName: project.name,
    });
  }

  return React.createElement(
    "div",
    { className: "flex flex-col gap-4xl min-h-screen" },
    [
      React.createElement(
        "div",
        { key: "header", className: "flex items-center gap-3lg" },
        [
          React.createElement(
            "div",
            { key: "project-info", className: "flex-1" },
            [
              React.createElement(
                "h3",
                {
                  key: "project-title",
                  className: "text-stat-font text-lg font-semibold font-noto",
                },
                project.name
              ),
              React.createElement(
                "p",
                {
                  key: "project-date",
                  className: "text-stat-font-secondary text-sm font-noto",
                },
                `Created: ${formatDate(project.createdAt)}`
              ),
            ]
          ),
        ]
      ),
      React.createElement(
        "div",
        {
          key: "content",
          className: "flex items-center justify-center flex-col gap-3lg",
        },
        [
          // DragDropZone only в UPLOAD/RESULT
          showDragDropZone &&
            React.createElement(DragDropZone, {
              key: "drag-drop",
              disabled: false,
            }),
          additionalContent,
        ].filter(Boolean)
      ),
    ].filter(Boolean)
  );
};

module.exports = { ProjectViewPage };
