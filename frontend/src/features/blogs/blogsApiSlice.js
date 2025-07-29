import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const blogsAdapter = createEntityAdapter({})

const initialState = blogsAdapter.getInitialState()


export const blogsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBlogs: builder.query({
            query: () => ({
                url: '/blogs',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedBlogs = responseData.map(blog => {
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
        addNewBlog: builder.mutation({
            query:  (data) => ({
                url: '/blogs',
                method: 'POST',
                body: data
                
            }),
            invalidatesTags: [
                { type: 'Blog', id: "LIST" }
            ]
        }),
        updateBlog: builder.mutation({
            query:  (data) => ({
                url: '/blogs',
                method: 'PATCH',
                body: data
                
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Blog', id: arg.id }
            ]
        }),
        deleteImageBlog: builder.mutation({
            query:  (data) => ({
                url: '/blogs',
                method: 'PUT',
                body: data
                
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Blog', id: arg.id }
            ]
        }),
        deleteBlog: builder.mutation({
            query: ({ id }) => ({
                url: `/blogs`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Blog', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetBlogsQuery,
    useAddNewBlogMutation,
    useDeleteImageBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogsApiSlice

// returns the query result object
export const selectBlogsResult = blogsApiSlice.endpoints.getBlogs.select()

// creates memoized selector
const selectBlogsData = createSelector(
    selectBlogsResult,
    blogsResult => blogsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllBlogs,
    selectById: selectBlogById,
    selectIds: selectBlogIds
    // Pass in a selector that returns the blogs slice of state
} = blogsAdapter.getSelectors(state => selectBlogsData(state) ?? initialState)



