import { apiSlice } from '../api/apiSlice.js';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to log in existing user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    // Mutation to register new user
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
