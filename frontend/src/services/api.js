import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// ─── Posts ───────────────────────────────────────────────────────────────────
export const postAPI = {
  getAll: (params) => api.get("/posts", { params }),
  getOne: (id) => api.get(`/posts/${id}`),
  create: (formData) => api.post("/posts", formData),
  update: (id, formData) => api.put(`/posts/${id}`, formData),
  remove: (id) => api.delete(`/posts/${id}`),
};
