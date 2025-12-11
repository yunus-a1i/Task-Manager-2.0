import api from './axios';

export const taskAPI = {
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  restoreTask: async (id) => {
    const response = await api.post(`/tasks/${id}/restore`);
    return response.data;
  },

  markComplete: async (id) => {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
  },

  markIncomplete: async (id) => {
    const response = await api.patch(`/tasks/${id}/incomplete`);
    return response.data;
  },

  getTrash: async () => {
    const response = await api.get('/tasks/trash');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/tasks/analytics');
    return response.data;
  }
};