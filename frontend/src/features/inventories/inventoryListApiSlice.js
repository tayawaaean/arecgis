import { apiSlice } from '../../app/api/apiSlice'

export const inventoryListApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryList: builder.query({
      query: ({ page = 1, limit = 100, username, isAdmin = false, userId }) => ({
        url: `/inventory-list?page=${page}&limit=${limit}&username=${username}&isAdmin=${isAdmin}&userId=${userId}`,
        method: 'GET',
      }),
      transformResponse: (response) => response,
    }),
  }),
})

export const { useGetInventoryListQuery } = inventoryListApiSlice