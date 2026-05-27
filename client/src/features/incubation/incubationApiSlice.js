import { apiSlice } from '../api/apiSlice.js';

export const incubationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIncubationSuggestions: builder.query({
      query: () => '/incubation/suggestions',
      // We can associate this query with the Asset tag type so that whenever
      // assets are updated/created, RTK Query automatically refetches the suggestions!
      providesTags: ['Asset'],
    }),
  }),
});

export const { 
  useGetIncubationSuggestionsQuery 
} = incubationApiSlice;
