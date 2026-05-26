import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../auth/authSlice.js';

// Setup standard RTK Query fetch mapping directly to our Express application gateway
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
  prepareHeaders: (headers, { getState }) => {
    // Dynamically retrieve active token from in-memory state slice
    const token = getState().auth.token;

    // Autoinject standard Bearer Authorization authorization headers
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Custom baseQuery wrapper incorporating 401 Expiry Interception
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Catch unauthenticated states (e.g. token expired, database account deleted)
  if (result.error && result.error.status === 401) {
    console.warn('[Session] Active credentials expired or became invalid. Commencing auto-logout...');
    
    // Dispatch core clean-up actions to evict variables
    api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Asset', 'Chat'],
  endpoints: () => ({}), // Domain endpoints are injected using code-splitting across module slices
});
