import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import { MapCacheProvider } from "../contexts/MapCacheContext"

const DashLayout = () => {
  return (
    <MapCacheProvider>
      <DashHeader />
      <main className="dash-main">
        <Outlet />
      </main>
    </MapCacheProvider>
  )
}

export default DashLayout