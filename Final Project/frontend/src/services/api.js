// src/services/api.js
import axios from "axios";

const API_BASE_USERS = "http://localhost:8080/api/users";
const API_BASE_PROJECTS = "http://localhost:8080/api/projects";

const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  validateStatus: (status) => status >= 200 && status < 500,
});

// User auth
export const registerUser = (userData) => axiosInstance.post(`${API_BASE_USERS}/add`, userData);
export const loginUser = (credentials) => axiosInstance.post(`${API_BASE_USERS}/login`, credentials);
export const getAllUsers = () => axiosInstance.get(`${API_BASE_USERS}/all`);

// Projects
export const createProject = (projectData) => axiosInstance.post(`${API_BASE_PROJECTS}`, projectData);
export const listProjects = (memberEmail) => {
  return axiosInstance.get(`${API_BASE_PROJECTS}${memberEmail ? "?member=" + encodeURIComponent(memberEmail) : ""}`);
};
export const getProject = (projectId) => axiosInstance.get(`${API_BASE_PROJECTS}/${projectId}`);
export const updateProject = (projectId, payload) => axiosInstance.put(`${API_BASE_PROJECTS}/${projectId}`, payload);
export const deleteProject = (projectId) => axiosInstance.delete(`${API_BASE_PROJECTS}/${projectId}`);

// Tasks
export const createTask = (projectId, taskPayload) => axiosInstance.post(`${API_BASE_PROJECTS}/${projectId}/tasks`, taskPayload);
export const updateTask = (projectId, taskId, payload) => axiosInstance.put(`${API_BASE_PROJECTS}/${projectId}/tasks/${taskId}`, payload);
export const deleteTask = (projectId, taskId) => axiosInstance.delete(`${API_BASE_PROJECTS}/${projectId}/tasks/${taskId}`);

// Chat
export const getAllMessages = () => axiosInstance.get("http://localhost:8080/api/chat");
export const sendMessage = (message) => axiosInstance.post("http://localhost:8080/api/chat", message);
