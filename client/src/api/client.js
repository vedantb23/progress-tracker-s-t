import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchProjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/projects`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
  return response.data;
};

export const fetchProjectDashboard = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/projects/${id}/dashboard`);
  return response.data;
};

export const fetchProjectItems = async (id, category = '') => {
  const response = await axios.get(`${API_BASE_URL}/projects/${id}/items`, {
    params: category ? { category } : {},
  });
  return response.data;
};

export const addItemToProject = async (projectId, itemData) => {
  const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/items`, itemData);
  return response.data;
};

export const updateItemProgress = async (itemId, executedQuantity) => {
  const response = await axios.put(`${API_BASE_URL}/items/${itemId}`, {
    executedQuantity,
  });
  return response.data;
};
