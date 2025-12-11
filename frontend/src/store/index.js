import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    categories: categoryReducer
  }
});