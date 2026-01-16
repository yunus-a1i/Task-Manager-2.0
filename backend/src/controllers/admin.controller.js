// controllers/admin.controller.js
import User from '../models/User.js';
import Task from '../models/Task.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// ==================== DASHBOARD & ANALYTICS ====================

// Get admin dashboard overview
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // User Statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const newUsersToday = await User.countDocuments({ 
      createdAt: { $gte: startOfToday } 
    });
    const newUsersThisWeek = await User.countDocuments({ 
      createdAt: { $gte: startOfWeek } 
    });
    const newUsersThisMonth = await User.countDocuments({ 
      createdAt: { $gte: startOfMonth } 
    });

    // Task Statistics
    const totalTasks = await Task.countDocuments({ isDeleted: false });
    const completedTasks = await Task.countDocuments({ 
      status: 'completed', 
      isDeleted: false 
    });
    const pendingTasks = await Task.countDocuments({ 
      status: 'pending', 
      isDeleted: false 
    });
    const overdueTasks = await Task.countDocuments({
      status: 'pending',
      dueDate: { $lt: new Date() },
      isDeleted: false
    });
    const tasksCreatedToday = await Task.countDocuments({
      createdAt: { $gte: startOfToday },
      isDeleted: false
    });
    const tasksCompletedToday = await Task.countDocuments({
      status: 'completed',
      updatedAt: { $gte: startOfToday },
      isDeleted: false
    });
    const deletedTasks = await Task.countDocuments({ isDeleted: true });

    // Category Statistics
    const totalCategories = await Category.countDocuments();

    // Completion Rate
    const completionRate = totalTasks > 0 
      ? ((completedTasks / totalTasks) * 100).toFixed(2) 
      : 0;

    // Priority Distribution
    const priorityDistribution = await Task.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Status Distribution
    const statusDistribution = await Task.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
        newToday: newUsersToday,
        newThisWeek: newUsersThisWeek,
        newThisMonth: newUsersThisMonth
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
        createdToday: tasksCreatedToday,
        completedToday: tasksCompletedToday,
        deleted: deletedTasks,
        completionRate: parseFloat(completionRate)
      },
      categories: {
        total: totalCategories
      },
      distributions: {
        priority: priorityDistribution,
        status: statusDistribution
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user growth analytics
export const getUserGrowthAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1
        }
      }
    ]);

    res.json({ userGrowth, period: days });
  } catch (error) {
    console.error('Get user growth analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get task analytics
export const getTaskAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Tasks created per day
    const tasksCreated = await Task.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1
        }
      }
    ]);

    // Tasks completed per day
    const tasksCompleted = await Task.aggregate([
      {
        $match: {
          status: 'completed',
          updatedAt: { $gte: startDate },
          isDeleted: false
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
            day: { $dayOfMonth: '$updatedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1
        }
      }
    ]);

    // Most active users (by task count)
    const mostActiveUsers = await Task.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$user', taskCount: { $sum: 1 } } },
      { $sort: { taskCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: 1,
          taskCount: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
          avatar: '$userInfo.avatar'
        }
      }
    ]);

    // Average tasks per user
    const totalTasks = await Task.countDocuments({ isDeleted: false });
    const totalUsers = await User.countDocuments();
    const avgTasksPerUser = totalUsers > 0 ? (totalTasks / totalUsers).toFixed(2) : 0;

    // Top streaks across all users
    const topStreaks = await Task.aggregate([
      { $match: { isDeleted: false, 'streak.count': { $gt: 0 } } },
      { $sort: { 'streak.count': -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          title: 1,
          'streak.count': 1,
          userName: '$userInfo.name',
          userEmail: '$userInfo.email'
        }
      }
    ]);

    res.json({
      tasksCreated,
      tasksCompleted,
      mostActiveUsers,
      avgTasksPerUser: parseFloat(avgTasksPerUser),
      topStreaks,
      period: days
    });
  } catch (error) {
    console.error('Get task analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get category analytics
export const getCategoryAnalytics = async (req, res) => {
  try {
    // Tasks per category
    const tasksPerCategory = await Task.aggregate([
      { $match: { isDeleted: false, category: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$categoryInfo.name',
          color: '$categoryInfo.color',
          icon: '$categoryInfo.icon'
        }
      }
    ]);

    // Most used categories
    const mostUsedCategories = await Category.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'category',
          as: 'tasks'
        }
      },
      {
        $project: {
          name: 1,
          color: 1,
          icon: 1,
          taskCount: { $size: '$tasks' }
        }
      },
      { $sort: { taskCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      tasksPerCategory,
      mostUsedCategories
    });
  } catch (error) {
    console.error('Get category analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== USER MANAGEMENT ====================

// Get all users with pagination, filtering, and sorting
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      isActive = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && ['user', 'admin'].includes(role)) {
      query.role = role;
    }

    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await User.countDocuments(query);

    // Get task counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const taskStats = await Task.aggregate([
          { $match: { user: user._id, isDeleted: false } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              },
              pending: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
              }
            }
          }
        ]);

        const stats = taskStats[0] || { total: 0, completed: 0, pending: 0 };

        return {
          ...user.toObject(),
          taskStats: stats
        };
      })
    );

    res.json({
      users: usersWithStats,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalUsers: total,
        hasMore: pageNum * limitNum < total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single user details with full stats
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's task statistics
    const taskStats = await Task.aggregate([
      { $match: { user: user._id, isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'pending'] },
                    { $lt: ['$dueDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get user's categories
    const categories = await Category.find({ user: user._id });

    // Get user's recent tasks
    const recentTasks = await Task.find({ user: user._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category');

    // Get user's top streaks
    const topStreaks = await Task.find({ 
      user: user._id, 
      isDeleted: false,
      'streak.count': { $gt: 0 }
    })
      .sort({ 'streak.count': -1 })
      .limit(5)
      .select('title streak');

    res.json({
      user,
      taskStats: taskStats[0] || {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
      },
      categories,
      recentTasks,
      topStreaks
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user (admin can update any user)
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, isActive, avatar } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing own role if you're the only admin
    if (userId === req.user._id.toString() && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 1) {
        return res.status(400).json({ 
          message: 'Cannot remove admin role. You are the only admin.' 
        });
      }
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined && ['user', 'admin'].includes(role)) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user and all their data
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Prevent self-deletion
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all user's tasks
    await Task.deleteMany({ user: userId });

    // Delete all user's categories
    await Category.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ 
      message: 'User and all associated data deleted successfully',
      deletedUserId: userId
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Suspend/Activate user
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Prevent self-suspension
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own status' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'suspended'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change user role
export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    // Prevent self-demotion if you're the only admin
    if (userId === req.user._id.toString() && role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 1) {
        return res.status(400).json({ 
          message: 'Cannot demote yourself. You are the only admin.' 
        });
      }
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role changed to ${role} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Change user role error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== TASK MANAGEMENT ====================

// Get all tasks across all users
export const getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      priority = '',
      userId = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeDeleted = 'false'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};

    if (includeDeleted !== 'true') {
      query.isDeleted = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && ['pending', 'completed', 'cancelled'].includes(status)) {
      query.status = status;
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.user = new mongoose.Types.ObjectId(userId);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const tasks = await Task.find(query)
      .populate('user', 'name email avatar')
      .populate('category', 'name color icon')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalTasks: total,
        hasMore: pageNum * limitNum < total
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get task details
export const getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(taskId)
      .populate('user', 'name email avatar')
      .populate('category', 'name color icon');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task permanently (admin)
export const deleteTaskPermanently = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ 
      message: 'Task deleted permanently',
      deletedTaskId: taskId
    });
  } catch (error) {
    console.error('Delete task permanently error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== CATEGORY MANAGEMENT ====================

// Get all categories across all users
export const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      userId = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.user = new mongoose.Types.ObjectId(userId);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const categories = await Category.find(query)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Category.countDocuments(query);

    // Get task count for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const taskCount = await Task.countDocuments({ 
          category: category._id,
          isDeleted: false
        });
        return {
          ...category.toObject(),
          taskCount
        };
      })
    );

    res.json({
      categories: categoriesWithStats,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCategories: total,
        hasMore: pageNum * limitNum < total
      }
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== SYSTEM MANAGEMENT ====================

// Get system health and statistics
export const getSystemHealth = async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get collection statistics
    const userCount = await User.estimatedDocumentCount();
    const taskCount = await Task.estimatedDocumentCount();
    const categoryCount = await Category.estimatedDocumentCount();

    // Memory usage
    const memoryUsage = process.memoryUsage();

    res.json({
      status: 'healthy',
      database: {
        status: dbStatus,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      collections: {
        users: userCount,
        tasks: taskCount,
        categories: categoryCount
      },
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`
      },
      uptime: `${Math.round(process.uptime())} seconds`,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clean up old deleted tasks
export const cleanupDeletedTasks = async (req, res) => {
  try {
    const { daysOld = 30 } = req.body;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

    const result = await Task.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: cutoffDate }
    });

    res.json({
      message: `Cleaned up ${result.deletedCount} deleted tasks older than ${daysOld} days`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup deleted tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create admin user (for initial setup)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    // Verify secret key (set this in your .env file)
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Invalid secret key' });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isActive: true
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk operations
export const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    // Filter out current admin's ID
    const filteredIds = userIds.filter(id => id !== req.user._id.toString());

    // Delete all tasks and categories for these users
    await Task.deleteMany({ user: { $in: filteredIds } });
    await Category.deleteMany({ user: { $in: filteredIds } });

    // Delete users
    const result = await User.deleteMany({ _id: { $in: filteredIds } });

    res.json({
      message: `${result.deletedCount} users deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const bulkDeleteTasks = async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: 'Task IDs array is required' });
    }

    const result = await Task.deleteMany({ _id: { $in: taskIds } });

    res.json({
      message: `${result.deletedCount} tasks deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk delete tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export data
export const exportData = async (req, res) => {
  try {
    const { type = 'all' } = req.query;

    let data = {};

    if (type === 'all' || type === 'users') {
      data.users = await User.find().select('-password -refreshToken');
    }

    if (type === 'all' || type === 'tasks') {
      data.tasks = await Task.find()
        .populate('user', 'name email')
        .populate('category', 'name');
    }

    if (type === 'all' || type === 'categories') {
      data.categories = await Category.find()
        .populate('user', 'name email');
    }

    data.exportedAt = new Date();
    data.exportedBy = req.user.email;

    res.json(data);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};