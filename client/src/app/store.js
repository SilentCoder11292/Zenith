import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import { apiSlice } from '../features/api/apiSlice.js';

/**
 * Global Redux Centralized Store
 * Orchestrates and binds feature states and API middle-layer queries.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Mount the auto-generated query slices caching middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
