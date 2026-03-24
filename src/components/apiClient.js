// ============================================================================
// AUTH TOKEN STORE
// ============================================================================
console.log("token on startup:", localStorage.getItem("access_token"));
const tokenStore = {
  _token: localStorage.getItem("access_token"), // load on startup;used to be null; need localStorage to use token/remember user logged-in
  setToken(token) { 
    this._token = token; 
    localStorage.setItem("access_token", token);
  },
  getToken() { return this._token; },
  clear() { 
    this._token = null; 
    localStorage.removeItem("access_token");
  },
  authHeader() {
    return this._token ? { Authorization: `Bearer ${this._token}` } : {};
  },
};

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

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No refresh token");
  
  const response = await fetch("http://localhost:8000/api/refresh_token", {
    method: "POST",
    headers: { Authorization: `Bearer ${refreshToken}` }
  });
  if (!response.ok) throw new Error("Refresh failed");
  
  const { access_token } = await response.json();
  tokenStore.setToken(access_token);
  return access_token;
};

// ============================================================================
// API CLIENT
// ============================================================================

const apiClient = {

  getProjects: async () => {
    const response = await fetch(
      `http://localhost:8000/api/get_projects`,
      { headers: tokenStore.authHeader() }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Failed to fetch projects (${response.status})`);
    }
    return response.json(); // [{ id, name, created }, ...]
  },

  createProject: async ({ name }) => {
    const params = new URLSearchParams({ name });

    const response = await fetch(
      `http://localhost:8000/api/create_project?${params.toString()}`,
      { method: "POST", headers: tokenStore.authHeader() }
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


  getProjectById: async (projectId) => {
    const [projectRes, filesRes] = await Promise.all([
      fetch(`http://localhost:8000/api/get_project/${projectId}`, { headers: tokenStore.authHeader() }),
      fetch(`http://localhost:8000/api/project_files/${projectId}`, { headers: tokenStore.authHeader() }),
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
    //we no longer need this? const params = new URLSearchParams({ email, password });
    const response = await fetch("http://localhost:8000/api/login_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Login failed (${response.status})`);
    }
    const result = await response.json(); // { user_id, email, runs_left, access_token, refresh_token }
    if (result?.access_token) {
      tokenStore.setToken(result.access_token);
      localStorage.setItem("access_token", result.access_token); // this makes sure we use token - user no need to login every time
    }
    if (result?.refresh_token) {
      localStorage.setItem("refresh_token", result.refresh_token);
    }
    return result;
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

module.exports = { apiClient, tokenStore, refreshAccessToken }; //export refreshAccessToken because needed in router.js