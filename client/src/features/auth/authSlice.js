import { createSlice } from '@reduxjs/toolkit';

// Retrieve session credentials safely from persistent browser local storage
const persistedToken = localStorage.getItem('token');
const persistedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  token: persistedToken || null,
  user: persistedUser || null,
  isAuthenticated: !!persistedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action dispatched upon login or registration success
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      // Sync variables to browser local storage for cross-reload persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    // Action dispatched to sign out user or upon receiving an expired token 401 code
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Evict stale cookies/local storage elements
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // Set explicit error descriptors
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthError } = authSlice.actions;
export default authSlice.reducer;
