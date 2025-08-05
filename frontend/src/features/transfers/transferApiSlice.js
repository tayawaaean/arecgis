import { apiSlice } from "../../app/api/apiSlice";

export const transferApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get transfers with pagination and filtering
    getTransfers: builder.query({
      query: ({ page = 1, limit = 10, username, isAdmin }) => {
        // Different endpoints based on role
        const endpoint = isAdmin ? '/transfers' : '/transfers/user';
        return {
          url: endpoint,
          params: { page, limit },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Transfer", id: _id })),
              { type: "Transfer", id: "LIST" },
            ]
          : [{ type: "Transfer", id: "LIST" }],
    }),

    // Get a single transfer by ID
    getTransfer: builder.query({
      query: (id) => `/transfers/${id}`,
      transformResponse: (response) => {
        return {
          ...response,
          status: response.status || 'unknown'
        };
      },
      providesTags: (result, error, id) => [{ type: "Transfer", id }],
    }),

    // Add a new transfer request
    addNewTransfer: builder.mutation({
      query: (formData) => ({
        url: "/transfers",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Transfer", id: "LIST" }],
    }),

    // Approve a transfer
    approveTransfer: builder.mutation({
      query: ({ id, notes }) => ({
        url: `/transfers/${id}/approve`,
        method: "PATCH",
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Transfer", id },
        { type: "Transfer", id: "LIST" },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    // Reject a transfer
    rejectTransfer: builder.mutation({
      query: ({ id, notes }) => ({
        url: `/transfers/${id}/reject`,
        method: "PATCH",
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Transfer", id },
        { type: "Transfer", id: "LIST" },
      ],
    }),

    // Check for existing transfers for an inventory
    checkExistingTransfers: builder.query({
      query: (inventoryId) => `/transfers/check/${inventoryId}`,
      providesTags: (result, error, inventoryId) => [
        { type: "TransferCheck", id: inventoryId },
      ],
    }),
    
    // Get document data as blob - using mutation for on-demand requests
    getTransferDocument: builder.mutation({
      query: ({ transferId, documentIndex }) => ({
        url: `/transfers/${transferId}/documents/${documentIndex}`,
        method: 'GET',
        responseHandler: 'blob',
      }),
    }),
  }),
});

export const {
  useGetTransfersQuery,
  useGetTransferQuery,
  useAddNewTransferMutation,
  useApproveTransferMutation,
  useRejectTransferMutation,
  useCheckExistingTransfersQuery,
  useGetTransferDocumentMutation,
} = transferApiSlice;