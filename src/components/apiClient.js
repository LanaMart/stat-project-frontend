const STORAGE_KEY = "statbridge_mock_data_v3";

let mockStorage = {
  projects: [],
  projectFiles: {}, // { arrayBuffer, metadata }
  projectStates: {},
};

// upload + clean the files
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    mockStorage.projects = parsed.projects || [];
    mockStorage.projectStates = parsed.projectStates || {};
    mockStorage.projectFiles = {};

    if (parsed.projectFiles) {
      Object.keys(parsed.projectFiles).forEach((id) => {
        const entry = parsed.projectFiles[id];
        if (entry && entry.arrayBuffer && entry.metadata) {
          mockStorage.projectFiles[id] = entry;
        }
      });
    }
  } else {
    const welcome = {
      id: "welcome_project_001",
      name: "My First Project",
      createdAt: new Date().toISOString(),
    };
    mockStorage.projects.push(welcome);
    mockStorage.projectStates[welcome.id] = {
      projectState: "upload",
      uploadSubState: "idle",
      hasUploadedFile: false,
    };
  }
} catch (e) {
  console.warn("Failed to load mock data", e);
}

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStorage));
  } catch (e) {
    console.warn("Failed to persist mock data", e);
  }
};

const simulateNetworkDelay = (ms = 200) =>
  new Promise((r) => setTimeout(r, ms));

// ============================================================================
// API CLIENT
// ============================================================================

const apiClient = {
  getProjects: async () => {
    await simulateNetworkDelay();
    return [...mockStorage.projects];
  },

  createProject: async (projectData) => {
    await simulateNetworkDelay();
    const newProject = {
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: projectData.name?.trim() || "Untitled Project",
      createdAt: new Date().toISOString(),
    };
    mockStorage.projects.unshift(newProject);
    mockStorage.projectStates[newProject.id] = {
      projectState: "upload",
      uploadSubState: "idle",
      hasUploadedFile: false,
    };
    persist();
    return newProject;
  },

  getProjectById: async (projectId) => {
    await simulateNetworkDelay();
    const project = mockStorage.projects.find((p) => p.id === projectId);
    const fileData = mockStorage.projectFiles[projectId];
    const stateData = mockStorage.projectStates[projectId];

    if (!project) return null;

    return {
      ...project,
      hasFile: !!fileData,
      fileName: fileData?.metadata?.name,
      fileSize: fileData?.metadata?.size,
      uploadedAt: fileData?.metadata?.uploadedAt,
      state: stateData || {
        projectState: "upload",
        uploadSubState: "idle",
        hasUploadedFile: false,
      },
    };
  },

  deleteProject: async (projectId) => {
    await simulateNetworkDelay();
    mockStorage.projects = mockStorage.projects.filter(
      (p) => p.id !== projectId
    );
    delete mockStorage.projectFiles[projectId];
    delete mockStorage.projectStates[projectId];
    persist();
    return { success: true };
  },

  validateFile: async (file) => {
    await simulateNetworkDelay();
    const errors = [];
    const allowed = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!allowed.includes(file.type)) errors.push("Only CSV/XLSX");
    if (file.size > 10 * 1024 * 1024) errors.push("Max 10MB");
    if (errors.length) return Promise.reject({ errors });
    return { valid: true };
  },

  uploadFile: async (projectId, file, onProgress) => {
    await simulateNetworkDelay(500);
    for (let i = 0; i <= 100; i += 20) {
      await simulateNetworkDelay(200);
      if (onProgress) onProgress(i);
    }

    const arrayBuffer = await file.arrayBuffer();
    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      uploadedAt: new Date().toISOString(),
    };

    mockStorage.projectFiles[projectId] = { arrayBuffer, metadata };
    mockStorage.projectStates[projectId] = {
      ...mockStorage.projectStates[projectId],
      hasUploadedFile: true,
      projectState: "interpretation",
      uploadSubState: "idle",
    };

    persist();
    return { success: true, file: metadata };
  },

  getProjectFile: async (projectId) => {
    await simulateNetworkDelay();
    const data = mockStorage.projectFiles[projectId];
    return data
      ? { exists: true, file: data.metadata }
      : { exists: false, file: null };
  },

  deleteProjectFile: async (projectId) => {
    await simulateNetworkDelay();
    delete mockStorage.projectFiles[projectId];
    if (mockStorage.projectStates[projectId]) {
      mockStorage.projectStates[projectId].hasUploadedFile = false;
      mockStorage.projectStates[projectId].projectState = "upload";
    }
    persist();
    return { success: true };
  },

  downloadProjectFile: async (projectId) => {
    await simulateNetworkDelay();
    const data = mockStorage.projectFiles[projectId];
    if (!data) throw new Error("File not found");
    const blob = new Blob([data.arrayBuffer], { type: data.metadata.type });
    return new File([blob], data.metadata.name, { type: data.metadata.type });
  },

  getProjectState: async (projectId) => {
    await simulateNetworkDelay();
    return (
      mockStorage.projectStates[projectId] || {
        projectState: "upload",
        uploadSubState: "idle",
        hasUploadedFile: false,
      }
    );
  },

  saveProjectState: async (projectId, state) => {
    await simulateNetworkDelay();
    mockStorage.projectStates[projectId] = {
      ...mockStorage.projectStates[projectId],
      ...state,
    };
    persist();
    return { success: true };
  },
};

module.exports = { apiClient };
