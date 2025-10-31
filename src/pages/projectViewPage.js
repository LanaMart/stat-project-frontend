const React = require("react");
const { MaterialIcon } = require("../components/button.js");
const { useRouter } = require("../router/router.js");
const {
  useUploadManager,
  DragDropZone,
  UploadProgress,
  ProcessingMessage,
} = require("../components/upload.js");

// Project View Page Component
const ProjectViewPage = ({ project }) => {
  const { navigate } = useRouter();
  const uploadManager = useUploadManager();

  // Get the project from parameters or from localStorage
  const currentProject = React.useMemo(() => {
    if (project) return project;

    try {
      const savedProject = localStorage.getItem("currentProject");
      return savedProject ? JSON.parse(savedProject) : null;
    } catch (error) {
      console.error("Error loading project from localStorage:", error);
      return null;
    }
  }, [project]);

  // If the project is not found, show an error message
  if (!currentProject) {
    return React.createElement(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 h-full",
      },
      [
        React.createElement(
          "div",
          {
            key: "error-message",
            className: "text-stat-font text-base text-center font-noto",
          },
          "Project not found"
        ),
      ]
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

  return React.createElement(
    "div",
    {
      className: "flex flex-col gap-4xl min-h-screen",
    },
    [
      // Header with back button
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex items-center gap-3lg",
        },
        [
          React.createElement(
            "div",
            {
              key: "project-info",
              className: "flex-1",
            },
            [
              React.createElement(
                "h3",
                {
                  key: "project-title",
                  className: "text-stat-font text-lg font-semibold font-noto",
                },
                currentProject.name
              ),
              React.createElement(
                "p",
                {
                  key: "project-date",
                  className: "text-stat-font-secondary text-sm font-noto",
                },
                `Created: ${formatDate(currentProject.createdAt)}`
              ),
            ]
          ),
        ]
      ),
      // Centered Drag and Drop Zone
      React.createElement(
        "div",
        {
          key: "drag-drop-container",
          className: "flex items-center justify-center flex-col gap-3lg",
        },
        React.createElement(DragDropZone, {
          key: "drag-drop",
          uploadManager: uploadManager,
          onFileSelect: uploadManager.startUpload,
        }),
        // Upload Progress
        uploadManager.uploadState !== uploadManager.UPLOAD_STATES.IDLE &&
          React.createElement(UploadProgress, {
            key: "upload-progress",
            fileName: uploadManager.currentFile?.name,
            fileSize: uploadManager.currentFile?.size,
            uploadState: uploadManager.uploadState,
            progress: uploadManager.progress,
            onCancel: uploadManager.cancelUpload,
            processingTimeEstimate: uploadManager.processingTimeEstimate,
          })
      ),

      // Processing Message
      uploadManager.uploadState === uploadManager.UPLOAD_STATES.PROCESSING &&
        React.createElement(ProcessingMessage, {
          key: "processing-message",
        }),
    ].filter(Boolean)
  );
};

module.exports = { ProjectViewPage };
