import { apiSlice } from '../../app/api/apiSlice'

export const inventoryListApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryList: builder.query({
      query: ({ page = 1, limit = 100 }) => ({
        url: `/inventory-list?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      transformResponse: (response) => response,
    }),
  }),
})

export const { useGetInventoryListQuery } = inventoryListApiSlice