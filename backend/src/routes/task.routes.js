import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  restoreTask,
  markComplete,
  markIncomplete,
  getTrash,
  getAnalytics
} from '../controllers/task.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.get('/trash', protect, getTrash);
router.get('/analytics', protect, getAnalytics);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.post('/:id/restore', protect, restoreTask);
router.patch('/:id/complete', protect, markComplete);
router.patch('/:id/incomplete', protect, markIncomplete);

export default router;