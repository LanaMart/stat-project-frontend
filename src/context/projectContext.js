const React = require("react");
const { openDB } = require("idb");

// ============================================================================
// STATE CONSTANTS
// ============================================================================

/**
 * PROJECT_STATES - основные состояния проекта
 * UPLOAD - загрузка файла (начальное состояние)
 * INTERPRETATION - файл загружен, показываем dashboard с данными
 * VALIDATION - валидация данных
 * WIZARD - режим визарда для настройки
 * VISUALIZATION - визуализация данных
 * RESULT - результат (после отмены или ошибки)
 */
const PROJECT_STATES = {
  UPLOAD: "upload",
  INTERPRETATION: "interpretation",
  VALIDATION: "validation",
  WIZARD: "wizard",
  VISUALIZATION: "visualization",
  RESULT: "result",
};

/**
 * UPLOAD_STATES - подсостояния процесса загрузки
 * IDLE - ожидание загрузки файла (показываем DragDropZone)
 * UPLOADING - идёт загрузка файла
 * SUCCESS - файл успешно загружен
 * PROCESSING - идёт обработка файла (показываем прогресс)
 * ⚠️ REPORT_READY удалён - сразу переход к INTERPRETATION
 */
const UPLOAD_STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  SUCCESS: "success",
  PROCESSING: "processing",
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
  // 🔄 API INTEGRATION POINT: В будущем здесь будут данные из API
  hasUploadedFile: false, // Флаг наличия загруженного файла
  lastUploadedAt: null, // Дата последней загрузки
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
      // Полная перезапись состояния (используется при загрузке из localStorage)
      return { ...prev, ...action.payload };

    case "START_UPLOAD":
      // Начало загрузки файла
      return {
        ...prev,
        projectState: PROJECT_STATES.UPLOAD,
        uploadSubState: UPLOAD_STATES.UPLOADING,
        currentFile: action.file,
        progress: 0,
      };

    case "UPDATE_PROGRESS":
      // Обновление прогресса загрузки
      return {
        ...prev,
        progress: Math.min(action.progress, 100),
      };

    case "SET_SUCCESS":
      // Загрузка завершена успешно → переход к обработке
      return {
        ...prev,
        uploadSubState: UPLOAD_STATES.SUCCESS,
      };

    case "SET_PROCESSING":
      // Начало обработки файла на бэкенде
      return {
        ...prev,
        uploadSubState: UPLOAD_STATES.PROCESSING,
        processingTimeEstimate: action.estimate || "2 minutes",
      };

    case "COMPLETE_UPLOAD":
      // ⚠️ Изменено: сразу переход к Dashboard без промежуточного состояния
      // Обработка завершена → переход к просмотру данных (Your Data Dashboard)
      return {
        ...prev,
        uploadSubState: UPLOAD_STATES.IDLE,
        projectState: PROJECT_STATES.INTERPRETATION,
        hasUploadedFile: true,
        lastUploadedAt: new Date().toISOString(),
        progress: 100,
      };

    case "RESET":
      // Сброс к начальному состоянию (отмена загрузки)
      return {
        ...initialState,
        projectMeta: prev.projectMeta, // Сохраняем метаданные проекта
      };

    case "CANCEL_UPLOAD":
      // Отмена загрузки → возврат к DragDropZone
      return {
        ...prev,
        projectState: PROJECT_STATES.UPLOAD,
        uploadSubState: UPLOAD_STATES.IDLE,
        currentFile: null,
        progress: 0,
        processingTimeEstimate: null,
      };

    default:
      return prev;
  }
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * ProjectProvider - контекст для управления состоянием проекта
 *
 * @param {Object} props
 * @param {string} props.projectId - ID проекта
 * @param {Object} props.initialMeta - начальные метаданные проекта (name, createdAt)
 * @param {ReactNode} props.children - дочерние компоненты
 */
const ProjectProvider = ({
  children,
  projectId = "default",
  initialMeta = {},
}) => {
  const [state, dispatch] = React.useReducer(projectReducer, {
    ...initialState,
    projectMeta: initialMeta,
  });

  // Флаг для отслеживания первой загрузки
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // ============================================================================
  // LOAD STATE FROM STORAGE (on mount)
  // ============================================================================
  React.useEffect(() => {
    const loadProjectState = async () => {
      try {
        // 🔄 API INTEGRATION POINT: Замените на GET /api/projects/{projectId}/state
        // const response = await fetch(`/api/projects/${projectId}/state`);
        // const savedState = await response.json();

        // Загружаем состояние из localStorage
        const json = localStorage.getItem(`project_data_${projectId}`);

        if (json) {
          const savedState = JSON.parse(json);

          // Проверяем, есть ли сохранённый файл
          // Если файл был загружен ранее → сразу показываем Dashboard
          if (
            savedState.hasUploadedFile ||
            savedState.projectState === PROJECT_STATES.INTERPRETATION
          ) {
            dispatch({
              type: "SET_STATE",
              payload: {
                ...savedState,
                projectState: PROJECT_STATES.INTERPRETATION,
                uploadSubState: UPLOAD_STATES.IDLE,
                hasUploadedFile: true,
              },
            });
          } else {
            // Файл не загружен → показываем DragDropZone
            dispatch({
              type: "SET_STATE",
              payload: {
                ...savedState,
                projectState: PROJECT_STATES.UPLOAD,
                uploadSubState: UPLOAD_STATES.IDLE,
              },
            });
          }
        } else {
          // Новый проект → начальное состояние (DragDropZone)
          dispatch({
            type: "SET_STATE",
            payload: {
              projectState: PROJECT_STATES.UPLOAD,
              uploadSubState: UPLOAD_STATES.IDLE,
              hasUploadedFile: false,
            },
          });
        }

        // 🔄 API INTEGRATION POINT: Загрузка метаданных файла
        // const fileMetadata = await fetch(`/api/projects/${projectId}/file`);
        // if (fileMetadata.exists) { ... }

        // Загружаем файл из IndexedDB (если есть)
        const db = await openDB("ProjectDB", 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains("files")) {
              db.createObjectStore("files");
            }
          },
        });

        const file = await db.get("files", `file_${projectId}`);
        if (file) {
          dispatch({
            type: "SET_STATE",
            payload: { currentFile: file },
          });
        }
      } catch (err) {
        console.error("❌ Error loading project state:", err);
        // В случае ошибки - начальное состояние
        dispatch({
          type: "SET_STATE",
          payload: {
            projectState: PROJECT_STATES.UPLOAD,
            uploadSubState: UPLOAD_STATES.IDLE,
          },
        });
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadProjectState();
  }, [projectId]);

  // ============================================================================
  // AUTO-SAVE STATE TO STORAGE
  // ============================================================================
  React.useEffect(() => {
    // Не сохраняем при первой загрузке (пока грузим данные)
    if (isInitialLoad) return;

    const timer = setTimeout(async () => {
      try {
        // 🔄 API INTEGRATION POINT: Замените на POST /api/projects/{projectId}/state
        // await fetch(`/api/projects/${projectId}/state`, {
        //   method: 'POST',
        //   body: JSON.stringify(state)
        // });

        // Сохраняем состояние в localStorage
        localStorage.setItem(
          `project_data_${projectId}`,
          JSON.stringify({
            projectState: state.projectState,
            uploadSubState: state.uploadSubState,
            progress: state.progress,
            processingTimeEstimate: state.processingTimeEstimate,
            projectMeta: state.projectMeta,
            hasUploadedFile: state.hasUploadedFile,
            lastUploadedAt: state.lastUploadedAt,
            // Не сохраняем currentFile (он в IndexedDB)
          })
        );

        // 🔄 API INTEGRATION POINT: Сохранение файла
        // if (state.currentFile) {
        //   const formData = new FormData();
        //   formData.append('file', state.currentFile);
        //   await fetch(`/api/projects/${projectId}/file`, {
        //     method: 'POST',
        //     body: formData
        //   });
        // }

        // Сохраняем файл в IndexedDB
        if (state.currentFile) {
          const db = await openDB("ProjectDB", 1);
          await db.put("files", state.currentFile, `file_${projectId}`);
        }
      } catch (err) {
        console.error("❌ Error saving project state:", err);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(timer);
  }, [state, projectId, isInitialLoad]);

  // ============================================================================
  // UPLOAD SIMULATION (for development)
  // ============================================================================
  React.useEffect(() => {
    if (state.uploadSubState !== UPLOAD_STATES.UPLOADING) return;

    // 🔄 API INTEGRATION POINT: Замените на реальный upload
    // const uploadFile = async () => {
    //   const formData = new FormData();
    //   formData.append('file', state.currentFile);
    //
    //   const response = await fetch(`/api/projects/${projectId}/upload`, {
    //     method: 'POST',
    //     body: formData,
    //     onUploadProgress: (progressEvent) => {
    //       const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //       dispatch({ type: "UPDATE_PROGRESS", progress: percentCompleted });
    //     }
    //   });
    //
    //   if (response.ok) {
    //     dispatch({ type: "SET_SUCCESS" });
    //     dispatch({ type: "SET_PROCESSING", estimate: response.data.estimatedTime });
    //
    //     // Poll for processing status
    //     const checkStatus = setInterval(async () => {
    //       const status = await fetch(`/api/projects/${projectId}/status`);
    //       if (status.data.ready) {
    //         clearInterval(checkStatus);
    //         dispatch({ type: "COMPLETE_UPLOAD" });
    //       }
    //     }, 1000);
    //   }
    // };
    //
    // uploadFile();

    // ⚠️ Упрощённая симуляция: UPLOADING → SUCCESS → Dashboard сразу!
    // Симуляция загрузки (удалить при интеграции с API)
    const interval = setInterval(() => {
      const newProgress = Math.min(
        state.progress + Math.random() * 15 + 5,
        100
      );

      if (newProgress >= 100) {
        clearInterval(interval);
        // Переход: UPLOADING → SUCCESS → Dashboard сразу!
        setTimeout(() => dispatch({ type: "SET_SUCCESS" }), 800);
        setTimeout(() => dispatch({ type: "COMPLETE_UPLOAD" }), 1500);
      } else {
        dispatch({ type: "UPDATE_PROGRESS", progress: newProgress });
      }
    }, 300);

    return () => clearInterval(interval);
  }, [state.uploadSubState, state.progress, projectId]);

  // ============================================================================
  // CONTEXT API
  // ============================================================================

  /**
   * startUpload - начать загрузку файла
   * @param {File} file - файл для загрузки
   */
  const startUpload = (file) => {
    dispatch({ type: "START_UPLOAD", file });
  };

  /**
   * cancelUpload - отменить текущую загрузку
   */
  const cancelUpload = () => {
    dispatch({ type: "CANCEL_UPLOAD" });
  };

  /**
   * resetProject - полный сброс проекта (очистка данных)
   */
  const resetProject = () => {
    // 🔄 API INTEGRATION POINT: DELETE /api/projects/{projectId}/file
    dispatch({ type: "RESET" });
  };

  const value = {
    state,
    startUpload,
    cancelUpload,
    resetProject,
    PROJECT_STATES,
    UPLOAD_STATES,
    isLoading: isInitialLoad,
  };

  return React.createElement(ProjectContext.Provider, { value }, children);
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * useProject - хук для доступа к контексту проекта
 * @returns {Object} контекст проекта
 */
const useProject = () => {
  const context = React.useContext(ProjectContext);

  if (!context) {
    console.warn(
      "⚠️ useProject must be used within ProjectProvider. Returning empty object."
    );
    return {
      state: initialState,
      startUpload: () => {},
      cancelUpload: () => {},
      resetProject: () => {},
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
};
