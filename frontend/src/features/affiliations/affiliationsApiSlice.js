import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice"

const affiliationsAdapter = createEntityAdapter({})

const initialState = affiliationsAdapter.getInitialState()

export const affiliationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAffiliations: builder.query({
            query: ({ page = 1, limit = 5 } = {}) => ({
                url: `/affiliations?page=${page}&limit=${limit}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedAffiliations = responseData.data.map(affiliation => {
                    affiliation.id = affiliation._id
                    return affiliation
                })
                const result = affiliationsAdapter.setAll(initialState, loadedAffiliations)
                // Return an object with both the normalized data and metadata
                return {
                    ...result,
                    meta: responseData.meta
                }
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Affiliation', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Affiliation', id }))
                    ]
                } else return [{ type: 'Affiliation', id: 'LIST' }]
            }
        }),
        addNewAffiliation: builder.mutation({
            query: initialAffiliationData => ({
                url: '/affiliations',
                method: 'POST',
                body: {
                    ...initialAffiliationData,
                }
            }),
            invalidatesTags: [
                { type: 'Affiliation', id: "LIST" }
            ]
        }),
        updateAffiliation: builder.mutation({
            query: initialAffiliationData => ({
                url: '/affiliations',
                method: 'PATCH',
                body: {
                    ...initialAffiliationData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Affiliation', id: arg.id }
            ]
        }),

    }),
})

export const {
    useGetAffiliationsQuery,
    useAddNewAffiliationMutation,
    useUpdateAffiliationMutation
} = affiliationsApiSlice

// returns the query result object
export const selectAffiliationsResult = affiliationsApiSlice.endpoints.getAffiliations.select()

// creates memoized selector
const selectAffiliationsData = createSelector(
    selectAffiliationsResult,
    affiliationsResult => affiliationsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllAffiliations,
    selectById: selectAffiliationById,
    selectIds: selectAffiliationIds
    // Pass in a selector that returns the affiliations slice of state
} = affiliationsAdapter.getSelectors(state => selectAffiliationsData(state) ?? initialState);

// Selector for pagination metadata
export const selectAffiliationsMeta = createSelector(
    selectAffiliationsResult,
    affiliationsResult => affiliationsResult?.data?.meta
);

// Selector for all affiliations data including metadata
export const selectAffiliationsWithMeta = createSelector(
    selectAffiliationsResult,
    affiliationsResult => affiliationsResult?.data
);
