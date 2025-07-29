import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from "../../app/api/apiSlice"
var CryptoJS = require("crypto-js")

const publicInventoriesAdapter = createEntityAdapter({})

const initialState = publicInventoriesAdapter.getInitialState()

export const publicInventoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPublicInventories: builder.query({
            query: () => ({
                url: '/publicInventories',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                // const decrypted = key.decrypt(responseData, 'utf8')
                var bytes  = CryptoJS.AES.decrypt(responseData, "2023@REcMMSU");
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                const loadedInventories= decryptedData.map(inventory => {
                    inventory.id = inventory._id
                    return inventory
                })
                return publicInventoriesAdapter.setAll(initialState, loadedInventories)
            },
            // transformResponse: responseData => {
            //     const loadedInventories = responseData.map(inventory => {
            //         inventory.id = inventory._id
            //         return inventory
            //     })
            //     return publicInventoriesAdapter.setAll(initialState, loadedInventories)
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
        
    }),
})

export const {
    useGetInventoriesQuery,

} = publicInventoriesApiSlice

// returns the query result object
export const selectPublicInventoriesResult = publicInventoriesApiSlice.endpoints.getPublicInventories.select()

// creates memoized selector
const selectPublicInventoriesData = createSelector(
    selectPublicInventoriesResult,
    publicInventoriesResult => publicInventoriesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllPublicInventories,
    // Pass in a selector that returns the inventories slice of state
} = publicInventoriesAdapter.getSelectors(state => selectPublicInventoriesData(state) ?? initialState)



