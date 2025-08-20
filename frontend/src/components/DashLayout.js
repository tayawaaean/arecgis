import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"
import { MapCacheProvider } from "../contexts/MapCacheContext"

const DashLayout = () => {
  return (
    <MapCacheProvider>
      <DashHeader />
      <main className="dash-main">
        <Outlet />
      </main>
      <DashFooter />
    </MapCacheProvider>
  )
}

export default DashLayout