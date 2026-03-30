const React = require("react");
const { apiClient } = require("../components/apiClient.js");

// ============================================================================
// STATE CONSTANTS (single source of truth for states)
// ============================================================================

const PROJECT_STATES = {
  UPLOAD: "upload",
  INTERPRETATION: "interpretation",
  VALIDATION: "validation",
  WIZARD: "wizard",
  VISUALIZATION: "visualization",
  RESULT: "result",
};

const UPLOAD_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  PROCESSING: "processing",
  REPORT_READY: "report_ready", // Added to match upload.js definition
};

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  projectState: PROJECT_STATES.UPLOAD,
  uploadSubState: UPLOAD_STATES.IDLE,
  currentFile: null,
  progress: 0,
  processingTimeEstimate: null,
  projectMeta: { name: "", createdAt: "" },
  hasUploadedFile: false,
  lastUploadedAt: null,
};

// ============================================================================
// CONTEXT
// ============================================================================

const ProjectContext = React.createContext();

// ============================================================================
// REDUCER
// ============================================================================

const projectReducer = (prev, action) => {
  switch (action.type) {
    case "SET_STATE":
      return { ...prev, ...action.payload };

    case "START_UPLOAD":
      return {
        ...prev,
        projectState: PROJECT_STATES.UPLOAD,
        uploadSubState: UPLOAD_STATES.UPLOADING,
        currentFile: action.file,
        progress: 0,
      };

    case "UPDATE_PROGRESS":
      return {
        ...prev,
        progress: Math.min(action.progress, 100),
      };

    case "SET_SUCCESS":
      return {
        ...prev,
        uploadSubState: UPLOAD_STATES.SUCCESS,
        progress: 100,
      };

    case "COMPLETE_UPLOAD":
      return {
        ...prev,
        uploadSubState: UPLOAD_STATES.IDLE,
        projectState: PROJECT_STATES.INTERPRETATION,
        hasUploadedFile: true,
        lastUploadedAt: new Date().toISOString(),
        progress: 100,
      };

    case "CANCEL_UPLOAD":
      return {
        ...prev,
        projectState: PROJECT_STATES.UPLOAD,
        uploadSubState: UPLOAD_STATES.IDLE,
        currentFile: null,
        progress: 0,
        processingTimeEstimate: null,
      };

    case "RESET":
      return {
        ...initialState,
        projectMeta: prev.projectMeta,
      };

    default:
      return prev;
  }
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

const CURRENT_USER_ID = 1;
const CURRENT_PROJECT_ID = "project_X";

const ProjectProvider = ({
  children,
  projectId = CURRENT_PROJECT_ID,
  userId = CURRENT_USER_ID,
  initialMeta = {},
}) => {
  const [state, dispatch] = React.useReducer(projectReducer, {
    ...initialState,
    projectMeta: initialMeta,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const currentProjectIdRef = React.useRef(projectId);

  React.useEffect(() => {
    currentProjectIdRef.current = projectId;
  }, [projectId]);

  // ============================================================================
  // LOAD PROJECT DATA FROM BACKEND
  // ============================================================================

  React.useEffect(() => {
    let isCancelled = false;

    const loadProjectData = async () => {
      const loadId = projectId;
      setIsLoading(true);

      try {
        const projectData = await apiClient.getProjectById(loadId);
        console.log("Project data:", projectData);

        if (isCancelled || currentProjectIdRef.current !== loadId) return;

        if (!projectData) {
          // Если данных нет — показываем Upload
          dispatch({
            type: "SET_STATE",
            payload: {
              projectState: PROJECT_STATES.UPLOAD,
              uploadSubState: UPLOAD_STATES.IDLE,
              hasUploadedFile: false,
              currentFile: null,
              projectMeta: { name: "", createdAt: "" },
            },
          });
        } else {
          const hasFile = projectData.hasFile || false;

          const safeFile = projectData.fileName
            ? {
                name: projectData.fileName,
                size: projectData.fileSize || 0,
              }
            : null;

          if (hasFile) {
            dispatch({
              type: "SET_STATE",
              payload: {
                projectState: PROJECT_STATES.INTERPRETATION,
                uploadSubState: UPLOAD_STATES.IDLE,
                currentFile: safeFile,
                hasUploadedFile: true,
                lastUploadedAt: projectData.uploadedAt || null,
                projectMeta: {
                  name: projectData.name || "",
                  createdAt: projectData.createdAt || "",
                },
              },
            });
          } else {
            dispatch({
              type: "SET_STATE",
              payload: {
                projectState: PROJECT_STATES.UPLOAD,
                uploadSubState: UPLOAD_STATES.IDLE,
                currentFile: null,
                hasUploadedFile: false,
                projectMeta: {
                  name: projectData.name || "",
                  createdAt: projectData.createdAt || "",
                },
              },
            });
          }
        }
      } catch (error) {
        console.error("❌ Error loading project data:", error);

        if (!isCancelled && currentProjectIdRef.current === loadId) {
          dispatch({
            type: "SET_STATE",
            payload: {
              projectState: PROJECT_STATES.UPLOAD,
              uploadSubState: UPLOAD_STATES.IDLE,
              currentFile: null,
              hasUploadedFile: false,
            },
          });
        }
      } finally {
        if (!isCancelled && currentProjectIdRef.current === loadId) {
          setIsLoading(false);
        }
      }
    };

    loadProjectData();

    return () => {
      isCancelled = true;
    };
  }, [projectId]);

  // ============================================================================
  // CONTEXT API METHODS
  // ============================================================================

  const startUpload = async (file) => {
    dispatch({ type: "START_UPLOAD", file });

    try {
      const result = await apiClient.uploadFile(userId, projectId, file, (progress) => {
        dispatch({ type: "UPDATE_PROGRESS", progress });
      });

      dispatch({ type: "SET_SUCCESS" });

      setTimeout(() => {
        dispatch({ type: "COMPLETE_UPLOAD" });
      }, 1000);

      return result;
    } catch (error) {
      console.error("❌ Upload error:", error);
      dispatch({ type: "CANCEL_UPLOAD" });
      throw error;
    }
  };

  const cancelUpload = () => {
    dispatch({ type: "CANCEL_UPLOAD" });
  };

  const resetProject = async () => {
    try {
      await apiClient.deleteProjectFile(projectId);
      dispatch({ type: "RESET" });
    } catch (error) {
      console.error("❌ Error resetting project:", error);
      throw error;
    }
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = {
    state,
    startUpload,
    cancelUpload,
    resetProject,
    PROJECT_STATES,
    UPLOAD_STATES,
    isLoading,
    userId,
  };

  return React.createElement(ProjectContext.Provider, { value }, children);
};

// ============================================================================
// HOOK
// ============================================================================

const useProject = () => {
  const context = React.useContext(ProjectContext);

  if (!context) {
    console.warn(
      "⚠️ useProject must be used within ProjectProvider. Returning empty object."
    );
    return {
      state: initialState,
      startUpload: () => Promise.resolve(),
      cancelUpload: () => {},
      resetProject: () => Promise.resolve(),
      PROJECT_STATES,
      UPLOAD_STATES,
      isLoading: false,
    };
  }

  return context;
};

module.exports = {
  ProjectProvider,
  useProject,
  PROJECT_STATES,
  UPLOAD_STATES,
  CURRENT_USER_ID,
  CURRENT_PROJECT_ID,
};
