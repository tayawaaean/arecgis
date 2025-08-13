import { apiSlice } from "../../app/api/apiSlice";

export const requestsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get requests with pagination and filtering
    getRequests: builder.query({
      query: ({ page = 1, limit = 10, isAdmin, status = '', requestType = '' }) => {
        // Different endpoints based on role
        const endpoint = isAdmin ? '/requests' : '/requests/user';
        const params = { page, limit };
        
        // Add filters if provided
        if (status) {
          params.status = status;
        }
        if (requestType) {
          params.requestType = requestType;
        }
        
        return {
          url: endpoint,
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Request", id: _id })),
              { type: "Request", id: "LIST" },
            ]
          : [{ type: "Request", id: "LIST" }],
    }),

    // Get a single request by ID
    getRequest: builder.query({
      query: (id) => `/requests/${id}`,
      transformResponse: (response) => {
        return {
          ...response,
          status: response.status || 'unknown'
        };
      },
      providesTags: (result, error, id) => [{ type: "Request", id }],
    }),

    // Add a new request (transfer or account deletion)
    addNewRequest: builder.mutation({
      query: (formData) => ({
        url: "/requests",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Request", id: "LIST" }],
    }),

    // Approve a request
    approveRequest: builder.mutation({
      query: ({ id, notes, password }) => ({
        url: `/requests/${id}/approve`,
        method: "PATCH",
        body: { notes, password },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Request", id },
        { type: "Request", id: "LIST" },
        { type: "Inventory", id: "LIST" }, // Invalidate inventory list for transfer requests
        { type: "User", id: "LIST" }, // Invalidate user list for account deletion requests
      ],
    }),

    // Reject a request
    rejectRequest: builder.mutation({
      query: ({ id, notes, password, rejectionReason }) => ({
        url: `/requests/${id}/reject`,
        method: "PATCH",
        body: { notes, password, rejectionReason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Request", id },
        { type: "Request", id: "LIST" },
      ],
    }),

    // Download document
    downloadDocument: builder.mutation({
      query: ({ requestId, documentIndex }) => ({
        url: `/requests/${requestId}/documents/${documentIndex}`,
        method: "GET",
        responseHandler: 'blob',
      }),
    }),


  }),
});

export const {
  useGetRequestsQuery,
  useGetRequestQuery,
  useAddNewRequestMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
  useDownloadDocumentMutation,
} = requestsApiSlice;
