import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"

import { apiSlice } from "../../app/api/apiSlice"

const blogsAdapter = createEntityAdapter({})

const initialState = blogsAdapter.getInitialState()

export const publicBlogsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBlogs: builder.query({
            query: () => ({
                url: '/publicBlogs',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                let out
                out = String.fromCharCode(...responseData.split("!"))
                out = JSON.parse(out)
                const loadedBlogs = out.map(blog => {
                    blog.id = blog._id
                    return blog
                })
                return blogsAdapter.setAll(initialState, loadedBlogs)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Blog', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Blog', id }))
                    ]
                } else return [{ type: 'Blog', id: 'LIST' }]
            }
        }),
        
    }),
})

export const {
    useGetBlogsQuery,

} = publicBlogsApiSlice

// returns the query result object
export const selectBlogsResult = publicBlogsApiSlice.endpoints.getBlogs.select()

// creates memoized selector
const selectBlogsData = createSelector(
    selectBlogsResult,
    blogsResult => blogsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllBlogs,
    // Pass in a selector that returns the blogs slice of state
} = blogsAdapter.getSelectors(state => selectBlogsData(state) ?? initialState)



