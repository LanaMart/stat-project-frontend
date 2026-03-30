const React = require("react");
const { useRouter } = require("../router/router.js");
const {
  useProject,
  PROJECT_STATES,
  UPLOAD_STATES,
  ProjectProvider,
  CURRENT_USER_ID,
} = require("../context/projectContext.js");
const { DragDropZone, UploadProgress } = require("../components/upload.js");
const { ProjectHeader } = require("../components/projectHeader.js");
const { YourDataDashboard } = require("../components/yourDataDashboard.js");
const { apiClient } = require("../components/apiClient.js");

/**
 * ProjectViewPage - Project Main Page
 * - Automatic transition between DragDropZone and Dashboard
 *
 * Flow:
 * 1. New project / project without a file → DragDropZone
 * 2. File upload → UploadProgress over DragDropZone
 * 3. File uploaded → automatic transition to Dashboard
 * 4. Project with file → directly to Dashboard
 */
const ProjectViewPage = ({ project }) => {
  const { navigate } = useRouter();

  // ============================================================================
  // VALIDATION
  // ============================================================================

  if (!project || !project.id) {
    return React.createElement(
      "div",
      {
        "className": "flex flex-col items-center justify-center gap-4 h-full",
        "data-page": "ProjectView",
        "data-state": "error",
      },
      React.createElement(
        "div",
        { className: "text-stat-font text-base text-center font-noto" },
        "Project not found"
      )
    );
  }

  // ============================================================================
  // RENDER WITH PROVIDER
  // ============================================================================

  return React.createElement(
    ProjectProvider,
    {
      key: project.id,
      projectId: project.id,
      userId: CURRENT_USER_ID,
      initialMeta: { name: project.name, createdAt: project.createdAt },
    },
    React.createElement(ProjectViewContent, { project })
  );
};

/**
 * ProjectViewContent - page content (внутри Provider)
 */
const ProjectViewContent = ({ project }) => {
  const { state, cancelUpload, resetProject } = useProject();
  const { navigate } = useRouter();

  // ============================================================================
  // STATE CHECKS
  // ============================================================================

  // Checking if the file is loaded into the project
  const hasUploadedFile =
    state.projectState === PROJECT_STATES.INTERPRETATION ||
    state.projectState === PROJECT_STATES.VALIDATION ||
    state.projectState === PROJECT_STATES.WIZARD ||
    state.projectState === PROJECT_STATES.VISUALIZATION;

  // Show DragDropZone in UPLOAD state
  const showDragDropZone = state.projectState === PROJECT_STATES.UPLOAD;

  // Showing download progress over DragDropZone
  const showUploadProgress =
    state.projectState === PROJECT_STATES.UPLOAD &&
    (state.uploadSubState === UPLOAD_STATES.UPLOADING ||
      state.uploadSubState === UPLOAD_STATES.SUCCESS);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAddFile = () => {
    console.log("Add another file");
    // TODO: connect to backend API here
    // Logic for adding an additional file
    // For now, we'll just return to the upload state
    resetProject();
  };

  const handleViewFile = async () => {
    console.log("View file:", state.currentFile?.name);
    // TODO: connect to backend API here
    // GET /api/projects/{projectId}/files/preview
    // Open the file in a new window or modal window
  };

  const handleDownloadFile = async () => {
    console.log("Download file:", state.currentFile?.name);
    try {
      // TODO: connect to backend API here
      const blob = await apiClient.downloadProjectFile(project.id);

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = state.currentFile?.name || "data.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("❌ Download error:", error);
      // TODO: Show error notificationе
    }
  };

  const handleDeleteFile = async () => {
    console.log("Delete file:", state.currentFile?.name);
    // TODO: connect to backend API here
    // Show confirmation dialog, then:
    // DELETE /api/projects/{projectId}/files/{fileId}

    try {
      await resetProject();
    } catch (error) {
      console.error("❌ Delete error:", error);
      // TODO: Show error notification
    }
  };

  const handleStartAnalyze = async () => {
    console.log("Start data analyze");
    try {
      // TODO: connect to backend API here
      // POST /api/projects/{projectId}/analyze
      const result = await apiClient.startAnalysis(project.id);

      console.log("Analysis started:", result);

      //TODO: Go to the analysis page or show progress
      // navigate(`/projects/${project.id}/analyze`);
    } catch (error) {
      console.error("❌ Analysis error:", error);
      // TODO: Show error message
    }
  };

  // ============================================================================
  // MAIN CONTENT RENDERING
  // ============================================================================

  let mainContent = null;

  if (showDragDropZone) {
    // Showing DragDropZone with UploadProgress
    mainContent = React.createElement(
      "div",
      {
        key: "drag-drop-container",
        className:
          "contentContainer gap-3lg flex flex-col items-center flex-1 self-stretch relative",
      },
      [
        // DragDropZone is always visible during the UPLOAD process
        React.createElement(DragDropZone, {
          key: "drag-drop",
          disabled: state.uploadSubState !== UPLOAD_STATES.IDLE,
        }),

        // UploadProgress is shown on top of DragDropZone
        showUploadProgress &&
          React.createElement(
            "div",
            {
              key: "progress-overlay",
              className:
                "inset-0 flex items-center justify-center pointer-events-none",
            },
            React.createElement(
              "div",
              {
                className: "pointer-events-auto",
              },
              React.createElement(UploadProgress, {
                fileName: state.currentFile?.name,
                fileSize: state.currentFile?.size,
                uploadState: state.uploadSubState,
                progress: state.progress,
                onCancel: cancelUpload,
                processingTimeEstimate: state.processingTimeEstimate,
              })
            )
          ),
      ].filter(Boolean)
    );
  } else if (hasUploadedFile) {
    // Showing the Dashboard with data
    mainContent = React.createElement(YourDataDashboard, {
      key: "data-dashboard",
      projectId: project.id,
      projectName: project.name,
      fileName: state.currentFile?.name || "data.csv",
      onAddFile: handleAddFile,
      onViewFile: handleViewFile,
      onDownloadFile: handleDownloadFile,
      onDeleteFile: handleDeleteFile,
      onStartAnalyze: handleStartAnalyze,
    });
  }

  // ============================================================================
  // FULL PAGE RENDER
  // ============================================================================

  return React.createElement(
    "div",
    {
      "className":
        "projectContent flex flex-col h-full w-full min-h-0 gap-4xl bg-stat-bg",
      "data-page": "ProjectView",
      "data-project-id": project.id,
    },
    [
      // Header
      React.createElement(ProjectHeader, {
        key: "header",
        project: project,
      }),

      // Main Content
      mainContent,
    ].filter(Boolean)
  );
};

module.exports = { ProjectViewPage };
