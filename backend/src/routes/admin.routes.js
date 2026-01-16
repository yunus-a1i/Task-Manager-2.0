// routes/admin.routes.js
import express from 'express';
import { protect, isAdmin } from '../middleware/admin.middleware.js';
import {
  // Dashboard & Analytics
  getDashboardStats,
  getUserGrowthAnalytics,
  getTaskAnalytics,
  getCategoryAnalytics,
  
  // User Management
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  
  // Task Management
  getAllTasks,
  getTaskDetails,
  deleteTaskPermanently,
  
  // Category Management
  getAllCategories,
  
  // System Management
  getSystemHealth,
  cleanupDeletedTasks,
  createAdmin,
  bulkDeleteUsers,
  bulkDeleteTasks,
  exportData
} from '../controllers/admin.controller.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// ==================== DASHBOARD & ANALYTICS ====================
router.get('/dashboard', getDashboardStats);
router.get('/analytics/users', getUserGrowthAnalytics);
router.get('/analytics/tasks', getTaskAnalytics);
router.get('/analytics/categories', getCategoryAnalytics);

// ==================== USER MANAGEMENT ====================
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.patch('/users/:userId/toggle-status', toggleUserStatus);
router.patch('/users/:userId/role', changeUserRole);

// ==================== TASK MANAGEMENT ====================
router.get('/tasks', getAllTasks);
router.get('/tasks/:taskId', getTaskDetails);
router.delete('/tasks/:taskId', deleteTaskPermanently);

// ==================== CATEGORY MANAGEMENT ====================
router.get('/categories', getAllCategories);

// ==================== SYSTEM MANAGEMENT ====================
router.get('/system/health', getSystemHealth);
router.post('/system/cleanup', cleanupDeletedTasks);
router.post('/system/bulk-delete-users', bulkDeleteUsers);
router.post('/system/bulk-delete-tasks', bulkDeleteTasks);
router.get('/system/export', exportData);

// Create admin (special route - requires secret key)
router.post('/create-admin', createAdmin);

export default router;