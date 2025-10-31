const React = require("react");
const { openDB } = require("idb");

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
  REPORT_READY: "report_ready",
};

const initialState = {
  projectState: PROJECT_STATES.UPLOAD,
  uploadSubState: UPLOAD_STATES.IDLE,
  currentFile: null,
  progress: 0,
  processingTimeEstimate: null,
  projectMeta: { name: "", createdAt: "" },
};

const ProjectContext = React.createContext();

const ProjectProvider = ({
  children,
  projectId = "default",
  initialMeta = {},
}) => {
  // Added initialMeta for the new project
  const [state, dispatch] = React.useReducer(
    (prev, action) => {
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
          return { ...prev, progress: action.progress };
        case "SET_SUCCESS":
          return { ...prev, uploadSubState: UPLOAD_STATES.SUCCESS };
        case "SET_PROCESSING":
          return {
            ...prev,
            uploadSubState: UPLOAD_STATES.PROCESSING,
            processingTimeEstimate: "2-3 minutes",
          };
        case "SET_REPORT_READY":
          return {
            ...prev,
            uploadSubState: UPLOAD_STATES.REPORT_READY,
            projectState: PROJECT_STATES.INTERPRETATION,
          };
        case "RESET":
          return initialState;
        default:
          return prev;
      }
    },
    { ...initialState, projectMeta: initialMeta }
  ); // Initial с meta

  // Loading from Local Storage + IndexedDB
  React.useEffect(() => {
    const load = async () => {
      try {
        const json = localStorage.getItem(`project_data_${projectId}`);
        if (json) {
          const saved = JSON.parse(json);
          dispatch({ type: "SET_STATE", payload: saved });
        } else {
          // New project - reset to initial
          dispatch({ type: "RESET" });
        }

        const db = await openDB("ProjectDB", 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains("files"))
              db.createObjectStore("files");
          },
        });
        const file = await db.get("files", `file_${projectId}`);
        if (file) {
          dispatch({ type: "SET_STATE", payload: { currentFile: file } });
        }
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    load();
  }, [projectId]);

  // Autosave
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        localStorage.setItem(
          `project_data_${projectId}`,
          JSON.stringify(state)
        );

        if (state.currentFile) {
          const db = await openDB("ProjectDB", 1);
          await db.put("files", state.currentFile, `file_${projectId}`);
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state, projectId]);

  // Simulation
  React.useEffect(() => {
    if (state.uploadSubState !== UPLOAD_STATES.UPLOADING) return;

    const interval = setInterval(() => {
      const newProgress = Math.min(
        state.progress + Math.random() * 15 + 5,
        100
      );
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => dispatch({ type: "SET_SUCCESS" }), 800);
        setTimeout(() => dispatch({ type: "SET_PROCESSING" }), 2300);
        setTimeout(() => dispatch({ type: "SET_REPORT_READY" }), 5300);
      } else {
        dispatch({ type: "UPDATE_PROGRESS", progress: newProgress });
      }
    }, 300);

    return () => clearInterval(interval);
  }, [state.uploadSubState, state.progress]);

  const startUpload = (file) => {
    dispatch({ type: "START_UPLOAD", file });
  };

  const cancelUpload = () => {
    dispatch({ type: "RESET" });
  };

  const value = {
    state,
    startUpload,
    cancelUpload,
    PROJECT_STATES,
    UPLOAD_STATES,
  };

  return React.createElement(ProjectContext.Provider, { value }, children);
};

const useProject = () => React.useContext(ProjectContext) || {}; // Fallback

module.exports = { ProjectProvider, useProject, PROJECT_STATES, UPLOAD_STATES };
