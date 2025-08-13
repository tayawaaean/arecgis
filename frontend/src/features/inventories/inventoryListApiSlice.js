import { apiSlice } from '../../app/api/apiSlice'

export const inventoryListApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryList: builder.query({
      query: ({ page = 1, limit = 20, username, isAdmin = false, userId, filters = {} }) => {
        const params = new URLSearchParams()
        
        if (page) params.append('page', page.toString())
        if (limit) params.append('limit', limit.toString())
        if (username) params.append('username', username)
        if (isAdmin !== undefined) params.append('isAdmin', isAdmin.toString())
        if (userId) params.append('userId', userId)
        if (filters && Object.keys(filters).length > 0) {
          params.append('filters', JSON.stringify(filters))
        }
        
        return {
          url: `/inventory-list?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response) => {
        return {
          ...response,
          data: response.data?.map(inventory => ({
            ...inventory,
            id: inventory._id || inventory.id
          })) || []
        }
      },
      providesTags: (result, error, arg) => {
        if (result?.data) {
          return [
            { type: 'InventoryList', id: 'LIST' },
            ...result.data.map(inventory => ({ type: 'InventoryList', id: inventory.id }))
          ]
        } else return [{ type: 'InventoryList', id: 'LIST' }]
      }
    }),
    getInventoryListSummary: builder.query({
      query: ({ username, isAdmin = false, userId, filters = {} }) => {
        const params = new URLSearchParams()
        
        if (username) params.append('username', username)
        if (isAdmin !== undefined) params.append('isAdmin', isAdmin.toString())
        if (userId) params.append('userId', userId)
        if (filters && Object.keys(filters).length > 0) {
          params.append('filters', JSON.stringify(filters))
        }
        
        return {
          url: `/inventory-list/summary?${params.toString()}`,
          method: 'GET',
        }
      },
      transformResponse: (response) => {
        return response.data?.map(inventory => ({
          ...inventory,
          id: inventory._id || inventory.id
        })) || []
      },
      providesTags: [{ type: 'InventoryListSummary', id: 'LIST' }]
    }),
  }),
})

export const { 
  useGetInventoryListQuery,
  useGetInventoryListSummaryQuery 
} = inventoryListApiSlice

// Custom selectors for the paginated data
export const selectInventoryListItems = (state, queryArgs) => {
  const result = inventoryListApiSlice.endpoints.getInventoryList.select(queryArgs)(state)
  return result?.data?.data || []
}

export const selectInventoryListMeta = (state, queryArgs) => {
  const result = inventoryListApiSlice.endpoints.getInventoryList.select(queryArgs)(state)
  return result?.data?.meta || { page: 1, total: 0, limit: 20, totalPages: 0 }
}

export const selectAllInventories = (state, queryArgs) => {
  const result = inventoryListApiSlice.endpoints.getInventoryListSummary.select(queryArgs)(state)
  return result?.data || []
}