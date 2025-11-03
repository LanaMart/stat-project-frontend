/**
 * apiClient.js - Mock Backend API Interface
 *
 * Этот файл имитирует работу с Cloud Backend API.
 * В будущем все функции будут заменены на реальные HTTP-запросы.
 *
 * Все методы возвращают Promises и имитируют асинхронное поведение API.
 */

// ============================================================================
// MOCK DATA STORAGE (временное хранилище для разработки)
// ============================================================================

const mockStorage = {
  projects: [],
  projectFiles: {}, // { projectId: { file: File, metadata: {...} } }
  projectStates: {}, // { projectId: { state, uploadSubState, ... } }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Симулирует задержку сети
 */
const simulateNetworkDelay = (ms = 300) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Симулирует валидацию файла на backend
 */
const validateFile = (file) => {
  const errors = [];

  // Проверка типа файла
  const allowedTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push("Invalid file type. Only CSV, or XLSX allowed.");
  }

  // Проверка размера (макс 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errors.push("File too large. Maximum size is 10MB.");
  }

  // Симуляция случайной ошибки сервера (5% вероятность)
  if (Math.random() < 0.05) {
    errors.push("Server validation error. Please try again.");
  }

  return errors;
};

// ============================================================================
// API CLIENT
// ============================================================================

const apiClient = {
  // ==========================================================================
  // PROJECTS ENDPOINTS
  // ==========================================================================

  /**
   * Получить список всех проектов пользователя
   * @returns {Promise<Array>} - список проектов
   */
  getProjects: async () => {
    // TODO: connect to backend API here
    // GET /api/projects
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();
    return Promise.resolve(mockStorage.projects);
  },

  /**
   * Создать новый проект
   * @param {Object} projectData - данные проекта (name, description)
   * @returns {Promise<Object>} - созданный проект с id
   */
  createProject: async (projectData) => {
    // TODO: connect to backend API here
    // POST /api/projects
    // Body: { name, description }
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    const newProject = {
      id: `project_${Date.now()}`,
      name: projectData.name,
      createdAt: new Date().toISOString(),
      ...projectData,
    };

    mockStorage.projects.push(newProject);
    mockStorage.projectStates[newProject.id] = {
      projectState: "upload",
      uploadSubState: "idle",
      hasUploadedFile: false,
    };

    return Promise.resolve(newProject);
  },

  /**
   * Получить информацию о проекте по ID
   * @param {string} projectId
   * @returns {Promise<Object>} - данные проекта
   */
  getProjectById: async (projectId) => {
    // TODO: connect to backend API here
    // GET /api/projects/{projectId}
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    const project = mockStorage.projects.find((p) => p.id === projectId);
    const fileData = mockStorage.projectFiles[projectId];
    const stateData = mockStorage.projectStates[projectId];

    if (!project) {
      return Promise.resolve(null);
    }

    return Promise.resolve({
      ...project,
      hasFile: !!fileData,
      fileName: fileData?.metadata?.name,
      fileSize: fileData?.metadata?.size,
      uploadedAt: fileData?.metadata?.uploadedAt,
      state: stateData || { projectState: "upload", uploadSubState: "idle" },
    });
  },

  /**
   * Удалить проект
   * @param {string} projectId
   * @returns {Promise<Object>} - результат удаления
   */
  deleteProject: async (projectId) => {
    // TODO: connect to backend API here
    // DELETE /api/projects/{projectId}
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    mockStorage.projects = mockStorage.projects.filter(
      (p) => p.id !== projectId
    );
    delete mockStorage.projectFiles[projectId];
    delete mockStorage.projectStates[projectId];

    return Promise.resolve({ success: true, deletedId: projectId });
  },

  // ==========================================================================
  // FILE ENDPOINTS
  // ==========================================================================

  /**
   * Валидация файла перед загрузкой
   * @param {File} file - файл для валидации
   * @returns {Promise<Object>} - результат валидации
   */
  validateFile: async (file) => {
    // TODO: connect to backend API here
    // POST /api/files/validate
    // Body: FormData with file
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay(500);

    const errors = validateFile(file);

    if (errors.length > 0) {
      return Promise.reject({
        valid: false,
        errors: errors,
      });
    }

    return Promise.resolve({
      valid: true,
      errors: [],
    });
  },

  /**
   * Загрузка файла в проект
   * @param {string} projectId
   * @param {File} file - файл для загрузки
   * @param {Function} onProgress - callback для отслеживания прогресса (0-100)
   * @returns {Promise<Object>} - результат загрузки
   */
  uploadFile: async (projectId, file, onProgress) => {
    // TODO: connect to backend API here
    // POST /api/projects/{projectId}/files
    // Body: FormData with file
    // Headers: { Authorization: `Bearer ${token}` }
    // Use XMLHttpRequest or fetch with ReadableStream for progress tracking

    // Валидация файла
    const errors = validateFile(file);
    if (errors.length > 0) {
      return Promise.reject({
        success: false,
        errors: errors,
      });
    }

    // Симуляция загрузки с прогрессом
    const uploadDuration = 2000; // 2 секунды
    const steps = 20;
    const stepDuration = uploadDuration / steps;

    for (let i = 0; i <= steps; i++) {
      await simulateNetworkDelay(stepDuration);
      const progress = Math.min((i / steps) * 100, 100);
      if (onProgress) onProgress(progress);
    }

    // Сохраняем файл в mock storage
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    mockStorage.projectFiles[projectId] = {
      file: file,
      metadata: metadata,
    };

    // Обновляем состояние проекта
    mockStorage.projectStates[projectId] = {
      ...mockStorage.projectStates[projectId],
      hasUploadedFile: true,
      projectState: "interpretation",
      uploadSubState: "idle",
    };

    return Promise.resolve({
      success: true,
      file: metadata,
    });
  },

  /**
   * Получить метаданные файла проекта
   * @param {string} projectId
   * @returns {Promise<Object>} - метаданные файла
   */
  getProjectFile: async (projectId) => {
    // TODO: connect to backend API here
    // GET /api/projects/{projectId}/files
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    const fileData = mockStorage.projectFiles[projectId];

    if (!fileData) {
      return Promise.resolve({ exists: false, file: null });
    }

    return Promise.resolve({
      exists: true,
      file: fileData.metadata,
    });
  },

  /**
   * Удалить файл из проекта
   * @param {string} projectId
   * @returns {Promise<Object>} - результат удаления
   */
  deleteProjectFile: async (projectId) => {
    // TODO: connect to backend API here
    // DELETE /api/projects/{projectId}/files
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    delete mockStorage.projectFiles[projectId];

    // Обновляем состояние проекта
    if (mockStorage.projectStates[projectId]) {
      mockStorage.projectStates[projectId] = {
        projectState: "upload",
        uploadSubState: "idle",
        hasUploadedFile: false,
      };
    }

    return Promise.resolve({ success: true });
  },

  /**
   * Скачать файл проекта
   * @param {string} projectId
   * @returns {Promise<Blob>} - файл для скачивания
   */
  downloadProjectFile: async (projectId) => {
    // TODO: connect to backend API here
    // GET /api/projects/{projectId}/files/download
    // Headers: { Authorization: `Bearer ${token}` }
    // Response: Blob with appropriate Content-Disposition header

    await simulateNetworkDelay();

    const fileData = mockStorage.projectFiles[projectId];

    if (!fileData) {
      throw new Error("File not found");
    }

    return Promise.resolve(fileData.file);
  },

  // ==========================================================================
  // STATE MANAGEMENT (optional - if you want to save UI state on backend)
  // ==========================================================================

  /**
   * Получить состояние проекта
   * @param {string} projectId
   * @returns {Promise<Object>} - состояние проекта
   */
  getProjectState: async (projectId) => {
    // TODO: connect to backend API here
    // GET /api/projects/{projectId}/state
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    const state = mockStorage.projectStates[projectId];

    if (!state) {
      return Promise.resolve({
        projectState: "upload",
        uploadSubState: "idle",
        hasUploadedFile: false,
      });
    }

    return Promise.resolve(state);
  },

  /**
   * Сохранить состояние проекта
   * @param {string} projectId
   * @param {Object} state - состояние для сохранения
   * @returns {Promise<Object>} - результат сохранения
   */
  saveProjectState: async (projectId, state) => {
    // TODO: connect to backend API here
    // POST /api/projects/{projectId}/state
    // Body: state object
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    mockStorage.projectStates[projectId] = {
      ...mockStorage.projectStates[projectId],
      ...state,
    };

    return Promise.resolve({ success: true });
  },

  // ==========================================================================
  // ANALYSIS ENDPOINTS (for future features)
  // ==========================================================================

  /**
   * Запустить анализ данных
   * @param {string} projectId
   * @returns {Promise<Object>} - результат запуска анализа
   */
  startAnalysis: async (projectId) => {
    // TODO: connect to backend API here
    // POST /api/projects/{projectId}/analyze
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    return Promise.resolve({
      success: true,
      analysisId: `analysis_${Date.now()}`,
      estimatedTime: "2-3 minutes",
    });
  },

  /**
   * Получить статус анализа
   * @param {string} projectId
   * @param {string} analysisId
   * @returns {Promise<Object>} - статус анализа
   */
  getAnalysisStatus: async (projectId, analysisId) => {
    // TODO: connect to backend API here
    // GET /api/projects/{projectId}/analyze/{analysisId}/status
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    return Promise.resolve({
      status: "processing", // "processing" | "completed" | "failed"
      progress: 45,
      estimatedTimeRemaining: "1 minute",
    });
  },
};

module.exports = { apiClient };
