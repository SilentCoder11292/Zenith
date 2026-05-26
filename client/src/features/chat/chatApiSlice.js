import { apiSlice } from '../api/apiSlice.js';

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to fetch all chat history belonging to active user
    getChatHistory: builder.query({
      query: () => '/chat/history',
      providesTags: [{ type: 'Chat', id: 'LIST' }],
    }),
    // Mutation to send user message and retrieve stateful AI response
    sendChatMessage: builder.mutation({
      query: (messageData) => ({
        url: '/chat/message',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
    }),
  }),
});

export const { useGetChatHistoryQuery, useSendChatMessageMutation } = chatApiSlice;
