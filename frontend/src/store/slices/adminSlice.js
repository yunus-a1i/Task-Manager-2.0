// src/store/slices/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../api/admin.api';

// Dashboard
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminAPI.getDashboardStats();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchUserGrowthAnalytics = createAsyncThunk(
  'admin/fetchUserGrowthAnalytics',
  async (period = 30, { rejectWithValue }) => {
    try {
      return await adminAPI.getUserGrowthAnalytics(period);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchTaskAnalytics = createAsyncThunk(
  'admin/fetchTaskAnalytics',
  async (period = 30, { rejectWithValue }) => {
    try {
      return await adminAPI.getTaskAnalytics(period);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchCategoryAnalytics = createAsyncThunk(
  'admin/fetchCategoryAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      return await adminAPI.getCategoryAnalytics();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Users
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await adminAPI.getAllUsers(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'admin/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      return await adminAPI.getUserDetails(userId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      return await adminAPI.updateUser(userId, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async (userId, { rejectWithValue }) => {
    try {
      return await adminAPI.toggleUserStatus(userId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const changeUserRole = createAsyncThunk(
  'admin/changeUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      return await adminAPI.changeUserRole(userId, role);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Tasks
export const fetchAllTasks = createAsyncThunk(
  'admin/fetchAllTasks',
  async (params, { rejectWithValue }) => {
    try {
      return await adminAPI.getAllTasks(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteTaskPermanently = createAsyncThunk(
  'admin/deleteTaskPermanently',
  async (taskId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteTaskPermanently(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Categories
export const fetchAllCategories = createAsyncThunk(
  'admin/fetchAllCategories',
  async (params, { rejectWithValue }) => {
    try {
      return await adminAPI.getAllCategories(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// System
export const fetchSystemHealth = createAsyncThunk(
  'admin/fetchSystemHealth',
  async (_, { rejectWithValue }) => {
    try {
      return await adminAPI.getSystemHealth();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const cleanupDeletedTasks = createAsyncThunk(
  'admin/cleanupDeletedTasks',
  async (daysOld, { rejectWithValue }) => {
    try {
      return await adminAPI.cleanupDeletedTasks(daysOld);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const bulkDeleteUsers = createAsyncThunk(
  'admin/bulkDeleteUsers',
  async (userIds, { rejectWithValue }) => {
    try {
      return await adminAPI.bulkDeleteUsers(userIds);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const bulkDeleteTasks = createAsyncThunk(
  'admin/bulkDeleteTasks',
  async (taskIds, { rejectWithValue }) => {
    try {
      return await adminAPI.bulkDeleteTasks(taskIds);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const exportData = createAsyncThunk(
  'admin/exportData',
  async (type, { rejectWithValue }) => {
    try {
      return await adminAPI.exportData(type);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    // Dashboard
    dashboardStats: null,
    userGrowthAnalytics: null,
    taskAnalytics: null,
    categoryAnalytics: null,
    
    // Users
    users: [],
    usersPagination: null,
    selectedUser: null,
    
    // Tasks
    tasks: [],
    tasksPagination: null,
    selectedTask: null,
    
    // Categories
    categories: [],
    categoriesPagination: null,
    
    // System
    systemHealth: null,
    
    // UI State
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // User Growth Analytics
      .addCase(fetchUserGrowthAnalytics.fulfilled, (state, action) => {
        state.userGrowthAnalytics = action.payload;
      })
      
      // Task Analytics
      .addCase(fetchTaskAnalytics.fulfilled, (state, action) => {
        state.taskAnalytics = action.payload;
      })
      
      // Category Analytics
      .addCase(fetchCategoryAnalytics.fulfilled, (state, action) => {
        state.categoryAnalytics = action.payload;
      })
      
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch User Details
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.user.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload.user };
        }
        state.successMessage = action.payload.message;
      })
      
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
        state.successMessage = 'User deleted successfully';
      })
      
      // Toggle User Status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.user.id);
        if (index !== -1) {
          state.users[index].isActive = action.payload.user.isActive;
        }
        state.successMessage = action.payload.message;
      })
      
      // Change User Role
      .addCase(changeUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.user.id);
        if (index !== -1) {
          state.users[index].role = action.payload.user.role;
        }
        state.successMessage = action.payload.message;
      })
      
      // Fetch All Tasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.tasksPagination = action.payload.pagination;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Task Permanently
      .addCase(deleteTaskPermanently.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
        state.successMessage = 'Task deleted permanently';
      })
      
      // Fetch All Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.categoriesPagination = action.payload.pagination;
      })
      
      // System Health
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.systemHealth = action.payload;
      })
      
      // Cleanup
      .addCase(cleanupDeletedTasks.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      
      // Bulk Delete Users
      .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      
      // Bulk Delete Tasks
      .addCase(bulkDeleteTasks.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      });
  }
});

export const { clearError, clearSuccessMessage, clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;