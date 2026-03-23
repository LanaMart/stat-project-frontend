const STORAGE_KEY = "statSynergy_mock_data_v3";

let mockStorage = {
  projects: [],
  projectFiles: {}, // { arrayBuffer, metadata }
  projectStates: {},
};

// Load persisted data from localStorage
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    mockStorage.projects = parsed.projects || [];
    mockStorage.projectStates = parsed.projectStates || {};
    mockStorage.projectFiles = {};

    // Restore only valid file entries (arrayBuffer + metadata)
    if (parsed.projectFiles) {
      Object.keys(parsed.projectFiles).forEach((id) => {
        const entry = parsed.projectFiles[id];
        if (entry && entry.arrayBuffer && entry.metadata) {
          mockStorage.projectFiles[id] = entry;
        }
      });
    }
  }
} catch (e) {
  console.warn("Failed to load mock data – starting with empty state", e);
  // In case of corrupted data, reset to clean empty state
  mockStorage = {
    projects: [],
    projectFiles: {},
    projectStates: {},
  };
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
  /* used mock storage
  getProjects: async () => {
    await simulateNetworkDelay();
    return [...mockStorage.projects];
  },
  */

  getProjects: async (user_id) => {
    const params = new URLSearchParams({ user_id });
    const response = await fetch( 
      `http://localhost:8000/api/get_projects?${params.toString()}`
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Failed to fetch projects (${response.status})`);
    }
    return response.json(); // [{ id, name, created_at }, ...]
  },
  /* this was used to mock stuff
  createProject: async (projectData) => {
    await simulateNetworkDelay();
    const newProject = {
      id: "project_X",
      name: projectData.name?.trim() || "Untitled Project",
      createdAt: new Date().toISOString(),
    };
    mockStorage.projects.unshift(newProject); // Newest projects first
    mockStorage.projectStates[newProject.id] = {
      projectState: "upload",
      uploadSubState: "idle",
      hasUploadedFile: false,
    };
    persist();
    return newProject;
  },*/


  createProject: async ({ name, user_id }) => {
    const params = new URLSearchParams({ name, user_id });

    const response = await fetch(
      `http://localhost:8000/api/create_project?${params.toString()}`,
      { method: "POST" }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Create failed (${response.status})`);
    }

    const projectId = await response.json();

    return {
      id: projectId,
      name,
    };
  },


  getProjectById: async (projectId, userId) => {
    const [projectRes, filesRes] = await Promise.all([
      fetch(`http://localhost:8000/api/get_project/${projectId}`),
      fetch(`http://localhost:8000/api/project_files/${userId}/${projectId}`),
    ]);

    if (!projectRes.ok) return null;
    const project = await projectRes.json();
    if (!project) return null;

    const files = filesRes.ok ? await filesRes.json() : { hasFile: false };

    return {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      hasFile: files.hasFile,
      fileName: files.fileName,
      fileSize: files.fileSize,
      uploadedAt: files.uploadedAt,
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

  uploadFile: async (userId, projectId, file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    await new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
        }
      });
      xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
      xhr.open("POST", `http://localhost:8000/api/dataset/upload/${userId}/${projectId}`);
      xhr.send(formData);
    });

    const metadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      uploadedAt: new Date().toISOString(),
    };

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

  downloadProjectFile: async (userId, projectId, fileName) => {
    const bucket = "data-container1";
    const key = `users/${userId}/${projectId}/${fileName}`;
    const response = await fetch(
      `http://localhost:8000/api/dataset/${bucket}/${key}/download`
    );
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
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

  loginUser: async (email, password) => {
    const params = new URLSearchParams({ email, password });
    const response = await fetch(
      `http://localhost:8000/api/login_user?${params.toString()}`,
      { method: "POST" }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Login failed (${response.status})`);
    }
    return response.json(); // { user_id, email, runs_left } or null
  },

  registerUser: async (email, password) => {
    const params = new URLSearchParams({ email, password });
    const response = await fetch(
      `http://localhost:8000/register_user?${params.toString()}`,
      { method: "POST" }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Registration failed (${response.status})`);
    }
    return response.json(); // new user_id
  },
};

module.exports = { apiClient };
