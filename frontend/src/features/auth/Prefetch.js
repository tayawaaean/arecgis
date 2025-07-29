import { store } from '../../app/store'
import { renergiesApiSlice } from '../renergies/renergiesApiSlice'
import { inventoriesApiSlice } from '../inventories/inventoriesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    // useEffect(() => {
    //     store.dispatch(renergiesApiSlice.util.prefetch('getRenergies', 'renergiesList', { force: true }))
    //     store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    // }, [])

    useEffect(() => {
        // console.log('subscribing')
        // const renergies = store.dispatch(renergiesApiSlice.endpoints.getRenergies.initiate())
        const inventories = store.dispatch(inventoriesApiSlice.endpoints.getInventories.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            // console.log('unsubscribing')
            // renergies.unsubscribe()
            inventories.unsubscribe()
            users.unsubscribe()
        }
    }, [])
    return <Outlet />
}
export default Prefetch