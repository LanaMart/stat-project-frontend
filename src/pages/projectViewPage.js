const React = require("react");
const { useRouter } = require("../router/router.js");
const {
  useProject,
  PROJECT_STATES,
  UPLOAD_STATES,
} = require("../context/projectContext.js");
const { DragDropZone, UploadProgress } = require("../components/upload.js");
const { ProjectHeader } = require("../components/projectHeader.js");
const { YourDataDashboard } = require("../components/yourDataDashboard.js");

/**
 * ProjectViewPage - the main project page
 *
 * Responsible only for:
 * - Routing and project validity checking
 * - Managing the loading state via projectContext
 * - Conditional rendering of components (DragDropZone / Dashboard)
 *
 * Logic:
 * 1. DragDropZone is shown all the time while projectState === UPLOAD
 * 2. During loading (UPLOADING/SUCCESS), UploadProgress is shown ON TOP of DragDropZone
 * 3. After SUCCESS → immediately show Your Data Dashboard
 *
 * @param {Object} props
 * @param {Object} props.project - project object from the router
 * @param {string} props.project.id
 * @param {string} props.project.name
 * @param {string} props.project.createdAt
 */
const ProjectViewPage = ({ project }) => {
  const { navigate } = useRouter();
  const { state, cancelUpload } = useProject();

  // ============================================================================
  // VALIDATION
  // ============================================================================

  // Checking project validity
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
  // STATE CHECKS
  // ============================================================================

  // We are checking if the file has been uploaded.
  // 🔄 API INTEGRATION POINT: In the future, this will be verified via API.
  // GET /api/projects/{projectId}/files → { hasFiles: boolean, files: [...] }
  const hasUploadedFile =
    state.projectState === PROJECT_STATES.INTERPRETATION ||
    state.projectState === PROJECT_STATES.VALIDATION ||
    state.projectState === PROJECT_STATES.WIZARD ||
    state.projectState === PROJECT_STATES.VISUALIZATION;

  // We display the DragDropZone throughout the entire upload process (UPLOAD state).
  const showDragDropZone = state.projectState === PROJECT_STATES.UPLOAD;

  // Loading progress displayed over the DragDropZone (UPLOADING + SUCCESS)
  const showUploadProgress =
    state.projectState === PROJECT_STATES.UPLOAD &&
    (state.uploadSubState === UPLOAD_STATES.UPLOADING ||
      state.uploadSubState === UPLOAD_STATES.SUCCESS);

  // ============================================================================
  // MAIN CONTENT RENDERING
  // ============================================================================

  let mainContent = null;

  if (showDragDropZone) {
    // We display the DragDropZone with UploadProgress on top (if a file is being uploaded).
    mainContent = React.createElement(
      "div",
      {
        key: "drag-drop-container",
        className:
          "contentContainer flex flex-col items-center flex-1 self-stretch relative",
      },
      [
        // The DragDropZone is always displayed during the UPLOAD process.
        React.createElement(DragDropZone, {
          key: "drag-drop",
          disabled: state.uploadSubState !== UPLOAD_STATES.IDLE,
        }),

        // UploadProgress is displayed on top of DragDropZone (if a file is being uploaded).
        showUploadProgress &&
          React.createElement(
            "div",
            {
              key: "progress-overlay",
              className: "absolute inset-0 flex items-center justify-center",
            },
            React.createElement(UploadProgress, {
              fileName: state.currentFile?.name,
              fileSize: state.currentFile?.size,
              uploadState: state.uploadSubState,
              progress: state.progress,
              onCancel: cancelUpload,
              processingTimeEstimate: state.processingTimeEstimate,
            })
          ),
      ].filter(Boolean)
    );
  } else if (hasUploadedFile) {
    // Show the data dashboard
    mainContent = React.createElement(YourDataDashboard, {
      key: "data-dashboard",
      projectName: project.name,
      fileName: state.currentFile?.name || "data.csv",

      // 🔄 API INTEGRATION POINT: CTA's
      onAddFile: () => {
        console.log("Add another file");
        // TODO: Implement add file logic
        // navigate(`/projects/${project.id}/add-file`);
      },

      onViewFile: () => {
        console.log("View file:", state.currentFile?.name);
        // TODO: Implement view file logic
        // GET /api/projects/{projectId}/files/{fileId}/preview
      },

      onDownloadFile: () => {
        console.log("Download file:", state.currentFile?.name);
        // TODO: Implement download file logic
        // GET /api/projects/{projectId}/files/{fileId}/download
      },

      onDeleteFile: () => {
        console.log("Delete file:", state.currentFile?.name);
        // TODO: Implement delete file logic with confirmation
        // DELETE /api/projects/{projectId}/files/{fileId}
      },

      onStartAnalyze: () => {
        console.log("Start data analyze");
        // TODO: Implement analyze logic
        // POST /api/projects/{projectId}/analyze
        // navigate(`/projects/${project.id}/analyze`);
      },
    });
  }

  // ============================================================================
  // PAGE RENDER
  // ============================================================================

  return React.createElement(
    "div",
    {
      "className":
        "projectContent flex flex-col min-h-screen gap-4xl bg-stat-bg",
      "data-page": "ProjectView",
      "data-project-id": project.id,
      "data-state": state.projectState,
    },
    [
      // Header Component
      React.createElement(ProjectHeader, {
        key: "header",
        project: project,
      }),

      // Main Content Area
      mainContent,
    ]
  );
};

module.exports = { ProjectViewPage };
