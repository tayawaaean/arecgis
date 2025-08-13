import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"
var CryptoJS = require("crypto-js")

const inventoriesAdapter = createEntityAdapter({})

const initialState = inventoriesAdapter.getInitialState()


export const inventoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getInventories: builder.query({
            query: () => ({
                url: '/inventories',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                let data = responseData
                if (typeof responseData === 'string') {
                    try {
                        const secret = process.env.REACT_APP_SECRET_KEY || '2023@REcMMSU'
                        const bytes  = CryptoJS.AES.decrypt(responseData, secret)
                        const decoded = bytes.toString(CryptoJS.enc.Utf8)
                        data = JSON.parse(decoded)
                    } catch (e) {
                        data = []
                    }
                }
                const loadedInventories = (Array.isArray(data) ? data : []).map(inventory => {
                    inventory.id = inventory._id
                    return inventory
                })
                return inventoriesAdapter.setAll(initialState, loadedInventories)
            },
            // transformResponse: responseData => {
            //     const loadedInventories = responseData.map(inventory => {
            //         inventory.id = inventory._id
            //         return inventory
            //     })
            //     return inventoriesAdapter.setAll(initialState, loadedInventories)
            // },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Inventory', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Inventory', id }))
                    ]
                } else return [{ type: 'Inventory', id: 'LIST' }]
            }
        }),
        addNewInventory: builder.mutation({
            query:  (data) => ({
                url: '/inventories',
                method: 'POST',
                body: data
                
            }),
            invalidatesTags: [
                { type: 'Inventory', id: "LIST" }
            ]
        }),
        updateInventory: builder.mutation({
            query:  (data) => ({
                url: '/inventories',
                method: 'PATCH',
                body: data
                
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Inventory', id: arg.id }
            ]
        }),
        deleteImageInventory: builder.mutation({
            query:  (data) => ({
                url: '/inventories',
                method: 'PUT',
                body: data
                
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Inventory', id: arg.id }
            ]
        }),
        deleteInventory: builder.mutation({
            query: ({ id }) => ({
                url: `/inventories`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Inventory', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetInventoriesQuery,
    useAddNewInventoryMutation,
    useDeleteImageInventoryMutation,
    useUpdateInventoryMutation,
    useDeleteInventoryMutation,
} = inventoriesApiSlice

// returns the query result object
export const selectInventoriesResult = inventoriesApiSlice.endpoints.getInventories.select()

// creates memoized selector
const selectInventoriesData = createSelector(
    selectInventoriesResult,
    inventoriesResult => inventoriesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllInventories,
    selectById: selectInventoryById,
    selectIds: selectInventoryIds
    // Pass in a selector that returns the inventories slice of state
} = inventoriesAdapter.getSelectors(state => selectInventoriesData(state) ?? initialState)



