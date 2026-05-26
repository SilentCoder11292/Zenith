import { apiSlice } from '../api/apiSlice.js';

export const assetsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to fetch all assets for active user
    getAssets: builder.query({
      query: () => '/assets',
      providesTags: (result) =>
        result && result.data && result.data.assets
          ? [
              ...result.data.assets.map(({ _id }) => ({ type: 'Asset', id: _id })),
              { type: 'Asset', id: 'LIST' },
            ]
          : [{ type: 'Asset', id: 'LIST' }],
    }),
    // Mutation to create a new asset
    createAsset: builder.mutation({
      query: (assetData) => ({
        url: '/assets',
        method: 'POST',
        body: assetData,
      }),
      invalidatesTags: [{ type: 'Asset', id: 'LIST' }],
    }),
    // Mutation to update an existing asset
    updateAsset: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/assets/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Asset', id },
        { type: 'Asset', id: 'LIST' },
      ],
    }),
  }),
});

export const { 
  useGetAssetsQuery, 
  useCreateAssetMutation,
  useUpdateAssetMutation 
} = assetsApiSlice;
