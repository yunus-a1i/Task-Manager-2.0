import Task from '../models/Task.js';
import { updateStreak, calculateWeeklyStats } from '../utils/streak.js';

export const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      user: req.user._id
    };

    const task = await Task.create(taskData);
    await task.populate('category');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { 
      filter, 
      sort = 'dueDate', 
      category, 
      search 
    } = req.query;

    let query = { 
      user: req.user._id, 
      isDeleted: false 
    };

    // Apply filters
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.dueDate = { $gte: today, $lt: tomorrow };
    } else if (filter === 'upcoming') {
      query.dueDate = { $gt: new Date() };
      query.status = 'pending';
    } else if (filter === 'overdue') {
      query.dueDate = { $lt: new Date() };
      query.status = 'pending';
    } else if (filter === 'high-priority') {
      query.priority = 'high';
    } else if (filter === 'completed') {
      query.status = 'completed';
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = {};
    if (sort === 'date') {
      sortOption.dueDate = 1;
    } else if (sort === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      sortOption = { priority: 1 };
    } else if (sort === 'streak') {
      sortOption['streak.count'] = -1;
    } else {
      sortOption.dueDate = 1;
    }

    const tasks = await Task.find(query)
      .sort(sortOption)
      .populate('category');

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('category');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'user' && key !== 'streak') {
        task[key] = req.body[key];
      }
    });

    await task.save();
    await task.populate('category');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isDeleted = true;
    task.deletedAt = new Date();
    await task.save();

    res.json({ message: 'Task moved to trash' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: true
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found in trash' });
    }

    task.isDeleted = false;
    task.deletedAt = null;
    await task.save();

    res.json({ message: 'Task restored successfully', task });
  } catch (error) {
    console.error('Restore task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markComplete = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = 'completed';
    
    // Update streak
    updateStreak(task);

    await task.save();
    await task.populate('category');

    res.json({
      message: 'Task marked as complete',
      task
    });
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markIncomplete = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = 'pending';
    await task.save();
    await task.populate('category');

    res.json({
      message: 'Task marked as incomplete',
      task
    });
  } catch (error) {
    console.error('Mark incomplete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrash = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      isDeleted: true
    }).populate('category');

    res.json({ tasks });
  } catch (error) {
    console.error('Get trash error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const stats = calculateWeeklyStats(tasks);

    // Top streaks
    const topStreaks = tasks
      .filter(t => !t.isDeleted && t.streak.count > 0)
      .sort((a, b) => b.streak.count - a.streak.count)
      .slice(0, 5)
      .map(t => ({
        title: t.title,
        streak: t.streak.count
      }));

    // Priority breakdown
    const priorityBreakdown = {
      high: tasks.filter(t => !t.isDeleted && t.priority === 'high' && t.status === 'pending').length,
      medium: tasks.filter(t => !t.isDeleted && t.priority === 'medium' && t.status === 'pending').length,
      low: tasks.filter(t => !t.isDeleted && t.priority === 'low' && t.status === 'pending').length
    };

    res.json({
      stats,
      topStreaks,
      priorityBreakdown
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};