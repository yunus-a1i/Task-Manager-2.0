import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryAPI } from '../../api/category.api';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  return await categoryAPI.getCategories();
});

export const createCategory = createAsyncThunk('categories/create', async (data) => {
  return await categoryAPI.createCategory(data);
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }) => {
  return await categoryAPI.updateCategory(id, data);
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id) => {
  await categoryAPI.deleteCategory(id);
  return id;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload.categories;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload.category);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c._id === action.payload.category._id);
        if (index !== -1) {
          state.items[index] = action.payload.category;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload);
      });
  }
});

export default categorySlice.reducer;