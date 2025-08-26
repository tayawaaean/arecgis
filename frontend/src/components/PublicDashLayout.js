import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import PublicAppbar from '../config/PublicAppbar'

const PublicDashLayout = () => {
    return (
        <>
            <PublicAppbar />
                <div className="">
                    <Outlet />
                </div>

        </>
    )
}
export default PublicDashLayout