import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskAPI } from '../../api/task.api';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await taskAPI.getTasks(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { rejectWithValue }) => {
    try {
      return await taskAPI.createTask(taskData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await taskAPI.updateTask(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await taskAPI.deleteTask(id);
  return id;
});

export const toggleComplete = createAsyncThunk(
  'tasks/toggleComplete',
  async ({ id, completed }, { rejectWithValue }) => {
    try {
      if (completed) {
        return await taskAPI.markIncomplete(id);
      } else {
        return await taskAPI.markComplete(id);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAnalytics = createAsyncThunk('tasks/analytics', async () => {
  return await taskAPI.getAnalytics();
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    analytics: null,
    loading: false,
    error: null,
    filters: {
      filter: '',
      sort: 'date',
      category: '',
      search: ''
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { filter: '', sort: 'date', category: '', search: '' };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload.task._id);
        if (index !== -1) {
          state.items[index] = action.payload.task;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      .addCase(toggleComplete.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload.task._id);
        if (index !== -1) {
          state.items[index] = action.payload.task;
        }
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  }
});

export const { setFilters, clearFilters } = taskSlice.actions;
export default taskSlice.reducer;