// src/api/admin.api.js
import api from './axios';

export const adminAPI = {
  // Dashboard & Analytics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUserGrowthAnalytics: async (period = 30) => {
    const response = await api.get('/admin/analytics/users', { params: { period } });
    return response.data;
  },

  getTaskAnalytics: async (period = 30) => {
    const response = await api.get('/admin/analytics/tasks', { params: { period } });
    return response.data;
  },

  getCategoryAnalytics: async () => {
    const response = await api.get('/admin/analytics/categories');
    return response.data;
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserDetails: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  changeUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Task Management
  getAllTasks: async (params = {}) => {
    const response = await api.get('/admin/tasks', { params });
    return response.data;
  },

  getTaskDetails: async (taskId) => {
    const response = await api.get(`/admin/tasks/${taskId}`);
    return response.data;
  },

  deleteTaskPermanently: async (taskId) => {
    const response = await api.delete(`/admin/tasks/${taskId}`);
    return response.data;
  },

  // Category Management
  getAllCategories: async (params = {}) => {
    const response = await api.get('/admin/categories', { params });
    return response.data;
  },

  // System Management
  getSystemHealth: async () => {
    const response = await api.get('/admin/system/health');
    return response.data;
  },

  cleanupDeletedTasks: async (daysOld = 30) => {
    const response = await api.post('/admin/system/cleanup', { daysOld });
    return response.data;
  },

  bulkDeleteUsers: async (userIds) => {
    const response = await api.post('/admin/system/bulk-delete-users', { userIds });
    return response.data;
  },

  bulkDeleteTasks: async (taskIds) => {
    const response = await api.post('/admin/system/bulk-delete-tasks', { taskIds });
    return response.data;
  },

  exportData: async (type = 'all') => {
    const response = await api.get('/admin/system/export', { params: { type } });
    return response.data;
  }
};