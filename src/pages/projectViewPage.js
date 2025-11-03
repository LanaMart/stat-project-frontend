const React = require("react");
const { useRouter } = require("../router/router.js");
const {
  useProject,
  PROJECT_STATES,
  UPLOAD_STATES,
  ProjectProvider,
} = require("../context/projectContext.js");
const { DragDropZone, UploadProgress } = require("../components/upload.js");
const { ProjectHeader } = require("../components/projectHeader.js");
const { YourDataDashboard } = require("../components/yourDataDashboard.js");
const { apiClient } = require("../components/apiClient.js");

/**
 * ProjectViewPage - главная страница проекта
 *
 * Упрощённая версия без localStorage:
 * - Все данные загружаются через API
 * - Управление только UI-состояниями
 * - Автоматический переход между DragDropZone и Dashboard
 *
 * Flow:
 * 1. Новый проект / проект без файла → DragDropZone
 * 2. Загрузка файла → UploadProgress поверх DragDropZone
 * 3. Файл загружен → автоматический переход к Dashboard
 * 4. Проект с файлом → сразу Dashboard
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
      key: project.id, // Key для полного remount при смене проекта
      projectId: project.id,
      initialMeta: { name: project.name, createdAt: project.createdAt },
    },
    React.createElement(ProjectViewContent, { project })
  );
};

/**
 * ProjectViewContent - контент страницы проекта (внутри Provider)
 */
const ProjectViewContent = ({ project }) => {
  const { state, cancelUpload, resetProject } = useProject();
  const { navigate } = useRouter();

  // ============================================================================
  // STATE CHECKS
  // ============================================================================

  // Проверяем, загружен ли файл в проект
  const hasUploadedFile =
    state.projectState === PROJECT_STATES.INTERPRETATION ||
    state.projectState === PROJECT_STATES.VALIDATION ||
    state.projectState === PROJECT_STATES.WIZARD ||
    state.projectState === PROJECT_STATES.VISUALIZATION;

  // Показываем DragDropZone в состоянии UPLOAD
  const showDragDropZone = state.projectState === PROJECT_STATES.UPLOAD;

  // Показываем прогресс загрузки поверх DragDropZone
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
    // Логика добавления дополнительного файла
    // Пока просто возвращаемся к upload состоянию
    resetProject();
  };

  const handleViewFile = async () => {
    console.log("View file:", state.currentFile?.name);
    // TODO: connect to backend API here
    // GET /api/projects/{projectId}/files/preview
    // Открыть файл в новом окне или модальном окне
  };

  const handleDownloadFile = async () => {
    console.log("Download file:", state.currentFile?.name);
    try {
      // TODO: connect to backend API here
      const blob = await apiClient.downloadProjectFile(project.id);

      // Создаём ссылку для скачивания
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
      // TODO: Показать уведомление об ошибке
    }
  };

  const handleDeleteFile = async () => {
    console.log("Delete file:", state.currentFile?.name);
    // TODO: connect to backend API here
    // Показать диалог подтверждения, затем:
    // DELETE /api/projects/{projectId}/files/{fileId}

    try {
      await resetProject();
    } catch (error) {
      console.error("❌ Delete error:", error);
      // TODO: Показать уведомление об ошибке
    }
  };

  const handleStartAnalyze = async () => {
    console.log("Start data analyze");
    try {
      // TODO: connect to backend API here
      // POST /api/projects/{projectId}/analyze
      const result = await apiClient.startAnalysis(project.id);

      console.log("Analysis started:", result);

      // TODO: Переход к странице анализа или показ прогресса
      // navigate(`/projects/${project.id}/analyze`);
    } catch (error) {
      console.error("❌ Analysis error:", error);
      // TODO: Показать уведомление об ошибке
    }
  };

  // ============================================================================
  // MAIN CONTENT RENDERING
  // ============================================================================

  let mainContent = null;

  if (showDragDropZone) {
    // Показываем DragDropZone с опциональным UploadProgress
    mainContent = React.createElement(
      "div",
      {
        key: "drag-drop-container",
        className:
          "contentContainer flex flex-col items-center flex-1 self-stretch relative",
      },
      [
        // DragDropZone всегда видна в процессе UPLOAD
        React.createElement(DragDropZone, {
          key: "drag-drop",
          disabled: state.uploadSubState !== UPLOAD_STATES.IDLE,
        }),

        // UploadProgress показывается поверх DragDropZone
        showUploadProgress &&
          React.createElement(
            "div",
            {
              key: "progress-overlay",
              className:
                "absolute inset-0 flex items-center justify-center pointer-events-none",
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
    // Показываем Dashboard с данными
    mainContent = React.createElement(YourDataDashboard, {
      key: "data-dashboard",
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
        "projectContent flex flex-col min-h-screen gap-4xl bg-stat-bg",
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
