import { store } from '../app/store'

import { publicInventoriesApiSlice } from '../features/inventories/publicInventoriesApiSlice'
import { publicBlogsApiSlice } from '../features/blogs/publicBlogsApiSlice'

import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const PublicFetch = () => {
    // useEffect(() => {
    //     store.dispatch(renergiesApiSlice.util.prefetch('getRenergies', 'renergiesList', { force: true }))
    //     store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    // }, [])

    useEffect(() => {
        // console.log('subscribing')
        const publicInventories = store.dispatch(publicInventoriesApiSlice.endpoints.getPublicInventories.initiate())
        const blogs = store.dispatch(publicBlogsApiSlice.endpoints.getBlogs.initiate())

        return () => {
            // console.log('unsubscribing')
            publicInventories.unsubscribe()
            blogs.unsubscribe()
        }
    }, [])
    return <Outlet />
}
export default PublicFetch