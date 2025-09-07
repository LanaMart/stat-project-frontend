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

  // Получаем проект из параметров или из localStorage
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

  // Если проект не найден, показываем сообщение об ошибке
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
            className: "text-[#2d2a45] text-[18px] text-center",
            style: { fontFamily: "Noto Sans" },
          },
          "Project not found"
        ),
        React.createElement(
          "button",
          {
            key: "back-button",
            onClick: () => navigate("welcome"),
            className:
              "px-4 py-2 bg-[#6a5acd] text-white rounded-lg hover:bg-[#5a4abd] transition-colors",
            style: { fontFamily: "Noto Sans" },
          },
          "Back to Welcome"
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
      className: "flex flex-col gap-6",
    },
    [
      // Header with back button
      React.createElement(
        "div",
        {
          key: "header",
          className: "flex items-center gap-4",
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
                  className: "text-[#2d2a45] text-[18px] font-semibold",
                  style: { fontFamily: "Noto Sans" },
                },
                currentProject.name
              ),
              React.createElement(
                "p",
                {
                  key: "project-date",
                  className: "text-[#5e5c7f] text-[14px]",
                  style: { fontFamily: "Noto Sans" },
                },
                `Created: ${formatDate(currentProject.createdAt)}`
              ),
            ]
          ),
        ]
      ),

      // Drag and Drop Zone
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
        }),

      // Processing Message
      uploadManager.uploadState === uploadManager.UPLOAD_STATES.PROCESSING &&
        React.createElement(ProcessingMessage, {
          key: "processing-message",
        }),
    ].filter(Boolean)
  );
};

module.exports = { ProjectViewPage };
