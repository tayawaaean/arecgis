import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const renergiesAdapter = createEntityAdapter({})

const initialState = renergiesAdapter.getInitialState()


export const renergiesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRenergies: builder.query({
            query: () => ({
                url: '/renergies',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedRenergies = responseData.map(renergy => {
                    renergy.id = renergy._id
                    return renergy
                })
                return renergiesAdapter.setAll(initialState, loadedRenergies)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Renergy', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Renergy', id }))
                    ]
                } else return [{ type: 'Renergy', id: 'LIST' }]
            }
        }),
        addNewRenergy: builder.mutation({
            query:  (data) => ({
                url: '/renergies',
                method: 'POST',
                body: data
                
            }),
            invalidatesTags: [
                { type: 'Renergy', id: "LIST" }
            ]
        }),
        updateRenergy: builder.mutation({
            query:  (data) => ({
                url: '/renergies',
                method: 'PATCH',
                body: data
                
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Renergy', id: arg.id }
            ]
        }),
        deleteImageRenergy: builder.mutation({
            query:  (data) => ({
                url: '/renergies',
                method: 'PUT',
                body: data
                
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Renergy', id: arg.id }
            ]
        }),
        deleteRenergy: builder.mutation({
            query: ({ id }) => ({
                url: `/renergies`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Renergy', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetRenergiesQuery,
    useAddNewRenergyMutation,
    useDeleteImageRenergyMutation,
    useUpdateRenergyMutation,
    useDeleteRenergyMutation,
} = renergiesApiSlice

// returns the query result object
export const selectRenergiesResult = renergiesApiSlice.endpoints.getRenergies.select()

// creates memoized selector
const selectRenergiesData = createSelector(
    selectRenergiesResult,
    renergiesResult => renergiesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllRenergies,
    selectById: selectRenergyById,
    selectIds: selectRenergyIds
    // Pass in a selector that returns the renergies slice of state
} = renergiesAdapter.getSelectors(state => selectRenergiesData(state) ?? initialState)