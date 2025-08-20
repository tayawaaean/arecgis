import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice"
var CryptoJS = require("crypto-js")

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                let data = responseData
                // Backward compatibility: decrypt if server returned an encrypted string
                if (typeof responseData === 'string') {
                    try {
                        const secret = process.env.REACT_APP_SECRET_KEY || '2023@REcMMSU'
                        const bytes = CryptoJS.AES.decrypt(responseData, secret)
                        const decoded = bytes.toString(CryptoJS.enc.Utf8)
                        data = JSON.parse(decoded)
                    } catch (e) {
                        data = []
                    }
                }
                const loadedUsers = (Array.isArray(data) ? data : []).map(user => {
                    user.id = user._id  
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        getUserById: builder.query({
            query: (id) => ({
                url: `/users/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                let data = responseData
                // Backward compatibility: decrypt if server returned an encrypted string
                if (typeof responseData === 'string') {
                    try {
                        const secret = process.env.REACT_APP_SECRET_KEY || '2023@REcMMSU'
                        const bytes = CryptoJS.AES.decrypt(responseData, secret)
                        const decoded = bytes.toString(CryptoJS.enc.Utf8)
                        data = JSON.parse(decoded)
                    } catch (e) {
                        data = null
                    }
                }
                if (data) {
                    data.id = data._id
                    return data
                }
                return null
            },
            providesTags: (result, error, arg) => [
                { type: 'User', id: arg }
            ]
        }),
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        updateOwnProfile: builder.mutation({
            query: profileData => ({
                url: '/users/profile',
                method: 'PATCH',
                body: {
                    ...profileData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: 'LIST' }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useUpdateOwnProfileMutation,
    useDeleteUserMutation,
} = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)