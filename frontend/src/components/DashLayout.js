import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

const DashLayout = () => {
    return (
        <>
            <DashHeader />
                <main id="main-content" tabIndex="-1" role="main">
                    <Outlet />
                </main>
            {/* <DashFooter /> */}
        </>
    )
}
export default DashLayout