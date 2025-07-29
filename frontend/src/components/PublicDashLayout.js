import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'
import PublicAppbar from '../config/PublicAppbar'

const PublicDashLayout = () => {
    return (
        <>
            <PublicAppbar />
                <div className="">
                    <Outlet />
                </div>
            {/* <DashFooter /> */}
        </>
    )
}
export default PublicDashLayout