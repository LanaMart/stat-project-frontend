/**
 * apiClient.js - Mock Backend API Interface
 * This file simulates working with the Cloud Backend API.
 * In the future, all functions will be replaced with real HTTP requests.
 *
 * All methods return Promises and simulate the asynchronous behavior of the API.
 */

// ============================================================================
// MOCK DATA STORAGE (temporary storage for development)
// ============================================================================

const mockStorage = {
  projects: [
    {
      id: "test_project",
      name: "Test Project",
      createdAt: new Date().toISOString(),
    },
  ],
  projectFiles: {
    test_project: {
      file: new Blob(["header1,header2\n1,2\n3,4"], { type: "text/csv" }), // Mock CSV content
      metadata: {
        name: "test.csv",
        size: 20,
        type: "text/csv",
        uploadedAt: new Date().toISOString(),
      },
    },
  },
  projectStates: {
    test_project: {
      projectState: "interpretation",
      uploadSubState: "idle",
      hasUploadedFile: true,
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Simulates network latency
 */
const simulateNetworkDelay = (ms = 200) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Simulates file validation on the backend
 */
const validateFile = (file) => {
  const errors = [];

  // check the file type
  const allowedTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push("Invalid file type. Only CSV, or XLSX allowed.");
  }

  // check the size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errors.push("File too large. Maximum size is 10MB.");
  }

  // Simulates a random server error (5% probability)
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
   * Get a list of all user projects
   * @returns {Promise<Array>} - project lists
   */
  getProjects: async () => {
    // TODO: connect to backend API here
    // GET /api/projects
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();
    return Promise.resolve(mockStorage.projects);
  },

  /**
   * Create a new project through the sidebar
   * @param {Object} projectData - (name, description of the project)
   * @returns {Promise<Object>} - created project with uniq id
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
   * Get project information by ID / to change between projects, work in specific project
   * @param {string} projectId
   * @returns {Promise<Object>} - project data
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
   * Delete project
   * @param {string} projectId
   * @returns {Promise<Object>} - result of delete
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
   * Validating a file before uploading
   * @param {File} file - file for validation
   * @returns {Promise<Object>} - resukt of validation
   */
  validateFile: async (file) => {
    // TODO: connect to backend API here
    // POST /api/files/validate
    // Body: FormData with file
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    const errors = validateFile(file);

    if (errors.length > 0) {
      return Promise.reject({ errors });
    }

    return Promise.resolve({ valid: true });
  },

  /**
   * Upload a file to the project
   * @param {string} projectId
   * @param {File} file - file for download
   * @param {Function} onProgress - download progress callback
   * @returns {Promise<Object>} - download result
   */
  uploadFile: async (projectId, file, onProgress) => {
    // TODO: connect to backend API here
    // POST /api/projects/{projectId}/files
    // Body: FormData with file
    // Headers: { Authorization: `Bearer ${token}` }
    // onProgress: XMLHttpRequest.upload.onprogress

    await simulateNetworkDelay(500);

    // Simulating progress
    for (let i = 0; i <= 100; i += 20) {
      await simulateNetworkDelay(200);
      if (onProgress) onProgress(i);
    }

    // Saving the file to mock storage
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

    // Updating the project status
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
   * Get project file metadata
   * @param {string} projectId
   * @returns {Promise<Object>} - file metadata
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
   * Remove file from project
   * @param {string} projectId
   * @returns {Promise<Object>} - result of deletion
   */
  deleteProjectFile: async (projectId) => {
    // TODO: connect to backend API here
    // DELETE /api/projects/{projectId}/files
    // Headers: { Authorization: `Bearer ${token}` }

    await simulateNetworkDelay();

    delete mockStorage.projectFiles[projectId];

    // Updating the project status
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
   * Download the project file
   * @param {string} projectId
   * @returns {Promise<Blob>} - file for download
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
  // STATE MANAGEMENT (to save UI state of the project on backend)
  // ==========================================================================

  /**
   * Get the project status
   * @param {string} projectId
   * @returns {Promise<Object>} - project status
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
   * Save the project state
   * @param {string} projectId
   * @param {Object} state - state to save
   * @returns {Promise<Object>} - result of saving
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
   * Run data analysis
   * @param {string} projectId
   * @returns {Promise<Object>} - result of running the analysis
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
   * Get analysis status
   * @param {string} projectId
   * @param {string} analysisId
   * @returns {Promise<Object>} - analysis status
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
